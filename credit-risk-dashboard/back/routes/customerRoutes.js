import express from 'express';
import { Customer } from '../models/Customer.js';

const router = express.Router();

// POST endpoint to add a new customer
router.post('/add-customer', async (req, res) => {
  try {
    const customerData = req.body;
    const newCustomer = new Customer(customerData);
    await newCustomer.save();
    res.status(201).json({ message: 'Customer added successfully', customer: newCustomer });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add customer', details: error.message });
  }
});

export default router;