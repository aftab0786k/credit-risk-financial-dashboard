import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Customer } from '../type/customer';
import { calculateRiskScore } from '../utils/riskCalculator';

interface RiskScoreChartProps {
  customers: Customer[];
}

const RiskScoreChart: React.FC<RiskScoreChartProps> = ({ customers }) => {
  const riskDistribution = customers.reduce((acc, customer) => {
    const score = calculateRiskScore(customer);
    if (score >= 80) acc[0].value++;
    else if (score >= 60) acc[1].value++;
    else acc[2].value++;
    return acc;
  }, [
    { name: 'Low Risk', value: 0, color: '#22c55e' },
    { name: 'Medium Risk', value: 0, color: '#eab308' },
    { name: 'High Risk', value: 0, color: '#ef4444' },
  ]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md h-[400px]">
      <h3 className="text-lg font-semibold mb-4">Risk Score Distribution</h3>
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={riskDistribution}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
          >
            {riskDistribution.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskScoreChart;