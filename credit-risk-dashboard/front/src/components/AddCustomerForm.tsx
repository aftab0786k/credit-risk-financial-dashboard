import React, { useState } from 'react';
import axios from 'axios';

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    name: '',
    monthlyIncome: '',
    monthlyExpenses: '',
    creditScore: '',
    outstandingLoans: '',
    loanRepaymentHistory: '',
    accountBalance: '',
    status: 'Review',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/customers/add-customer', {
        ...formData,
        loanRepaymentHistory: formData.loanRepaymentHistory.split(',').map(Number),
      });
      alert(response.data.message);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error || error.response?.data?.message || error.message || 'An unknown error occurred';
      alert(`Failed to add customer: ${errorMessage}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Add New Customer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(formData) as Array<keyof typeof formData>).map((key) => (
          key !== 'loanRepaymentHistory' && (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{key}</label>
              <input
                type={
                  key === 'monthlyIncome' ||
                  key === 'monthlyExpenses' ||
                  key === 'creditScore' ||
                  key === 'outstandingLoans' ||
                  key === 'accountBalance'
                    ? 'number'
                    : 'text'
                }
                name={key}
                value={formData[key] as string | number}
                onChange={handleChange}
                className="w-full p-2 rounded-md text-black"
                required
              />
            </div>
          )
        ))}
        <div>
          <label className="block text-sm font-medium mb-1">Loan Repayment History (comma-separated)</label>
          <input
            type="text"
            name="loanRepaymentHistory"
            value={formData.loanRepaymentHistory}
            onChange={handleChange}
            className="w-full p-2 rounded-md text-black"
            required
          />
        </div>
      </div>
      <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white font-semibold">
        Submit
      </button>
    </form>
  );
};

export default AddCustomerForm;