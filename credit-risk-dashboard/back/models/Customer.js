import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema({
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  monthlyIncome: {
    type: Number,
    required: true
  },
  monthlyExpenses: {
    type: Number,
    required: true
  },
  creditScore: {
    type: Number,
    required: true
  },
  outstandingLoans: {
    type: Number,
    required: true
  },
  loanRepaymentHistory: {
    type: [Number],
    required: true
  },
  accountBalance: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Review', 'Approved', 'Rejected'],
    required: true
  }
}, {
  timestamps: true
});

export const Customer = mongoose.model('Customer', customerSchema);

// Add initial data if collection is empty
export const initializeData = async () => {
  try {
    const count = await Customer.countDocuments();
    if (count === 0) {
      const initialCustomers = [
        {
          customerId: "CUST1001",
          name: "Alice Johnson",
          monthlyIncome: 6200,
          monthlyExpenses: 3500,
          creditScore: 710,
          outstandingLoans: 15000,
          loanRepaymentHistory: [1, 0, 1, 1, 1, 1, 0, 1],
          accountBalance: 12500,
          status: "Review"
        },
        {
          customerId: "CUST1002",
          name: "Bob Smith",
          monthlyIncome: 4800,
          monthlyExpenses: 2800,
          creditScore: 640,
          outstandingLoans: 20000,
          loanRepaymentHistory: [1, 1, 1, 0, 0, 1, 0, 0],
          accountBalance: 7300,
          status: "Approved"
        },
        {
          customerId: "CUST1003",
          name: "Charlie Brown",
          monthlyIncome: 8500,
          monthlyExpenses: 4200,
          creditScore: 780,
          outstandingLoans: 25000,
          loanRepaymentHistory: [1, 1, 1, 1, 1, 1, 1, 1],
          accountBalance: 18000,
          status: "Review"
        },
        {
          customerId: "CUST1004",
          name: "Diana Martinez",
          monthlyIncome: 5500,
          monthlyExpenses: 3800,
          creditScore: 620,
          outstandingLoans: 30000,
          loanRepaymentHistory: [0, 0, 1, 0, 1, 0, 1, 0],
          accountBalance: 4500,
          status: "Rejected"
        },
        {
          customerId: "CUST1005",
          name: "Edward Wilson",
          monthlyIncome: 7200,
          monthlyExpenses: 4000,
          creditScore: 700,
          outstandingLoans: 18000,
          loanRepaymentHistory: [1, 1, 1, 1, 0, 1, 1, 1],
          accountBalance: 15000,
          status: "Approved"
        }
      ];
      await Customer.insertMany(initialCustomers);
      console.log('Initial data inserted');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};