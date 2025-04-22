import React, { useState } from 'react';
import { Customer } from '../type/customer';
import { calculateRiskScore, getRiskLevel } from '../utils/riskCalculator';
import { Search, SortAsc, SortDesc } from 'lucide-react';

interface CustomerTableProps {
  customers: Customer[];
  onStatusChange: (customerId: string, newStatus: Customer['status']) => void;
}

type SortField = 'name' | 'riskScore' | 'monthlyIncome' | 'creditScore';

const CustomerTable: React.FC<CustomerTableProps> = ({ customers, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedCustomers = [...customers]
    .filter(customer => 
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.customerId.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'riskScore':
          comparison = calculateRiskScore(a) - calculateRiskScore(b);
          break;
        case 'monthlyIncome':
          comparison = a.monthlyIncome - b.monthlyIncome;
          break;
        case 'creditScore':
          comparison = a.creditScore - b.creditScore;
          break;
      }
      return sortDirection === 'asc' ? comparison : -comparison;
    });

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? 
      <SortAsc className="w-4 h-4 inline ml-1" /> : 
      <SortDesc className="w-4 h-4 inline ml-1" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Customer
                <SortIcon field="name" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('riskScore')}
              >
                Risk Score
                <SortIcon field="riskScore" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('monthlyIncome')}
              >
                Income
                <SortIcon field="monthlyIncome" />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('creditScore')}
              >
                Credit Score
                <SortIcon field="creditScore" />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedCustomers.map((customer) => {
              const riskScore = calculateRiskScore(customer);
              const { level, color } = getRiskLevel(riskScore);
              
              return (
                <tr key={customer.customerId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                        <div className="text-sm text-gray-500">{customer.customerId}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`${color} w-2 h-2 rounded-full mr-2`}></div>
                      <span>{riskScore}% - {level}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${customer.monthlyIncome.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {customer.creditScore}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${customer.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                        customer.status === 'Rejected' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <select
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      value={customer.status}
                      onChange={(e) => onStatusChange(customer.customerId, e.target.value as Customer['status'])}
                    >
                      <option value="Review">Review</option>
                      <option value="Approved">Approved</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CustomerTable;