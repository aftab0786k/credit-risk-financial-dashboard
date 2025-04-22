import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { Customer, initializeData } from './models/Customer.js';
import customerRoutes from './routes/customerRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB with increased timeout
mongoose.connect(process.env.MONGODB_URL, {
  serverSelectionTimeoutMS: 30000,
  connectTimeoutMS: 30000,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Connected to MongoDB');
    // Initialize data after successful connection
    initializeData();
  })
  .catch((error) => console.error('MongoDB connection error:', error));

// Get all customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    console.log('Sending customers:', customers); // Debug log
    res.json(customers); // Send the array directly
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update customer status
app.patch('/api/customers/:customerId', async (req, res) => {
  try {
    const { status } = req.body;
    const customer = await Customer.findOneAndUpdate(
      { customerId: req.params.customerId },
      { status },
      { new: true }
    );
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get monthly trends data
app.get('/api/monthly-trends', async (req, res) => {
  try {
    const monthlyData = await Customer.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },
          avgIncome: { $avg: "$monthlyIncome" },
          avgExpenses: { $avg: "$monthlyExpenses" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formattedData = monthlyData.map(data => ({
      name: new Date(data._id.year, data._id.month - 1).toLocaleString('default', { month: 'short' }),
      income: Math.round(data.avgIncome),
      expenses: Math.round(data.avgExpenses)
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.use('/api/customers', customerRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});