import React from 'react';
import { BarChart3, Users, AlertTriangle } from 'lucide-react';


const DashboardHeader: React.FC = () => {

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg shadow-lg mb-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="text-white mb-4 md:mb-0">
          <h1 className="text-2xl md:text-3xl font-bold">Credit Risk Analytics Dashboard</h1>
          <p className="text-blue-100 lg:text-left text-center">Real-time financial insights and Credit Risk</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center px-4 py-2 bg-amber-50  bg-opacity-20 rounded-lg  hover:bg-opacity-30 transition-all">
            <BarChart3 className="w-5 h-5 mr-2" />
            <span>Analytics</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-amber-50  bg-opacity-20 rounded-lg  hover:bg-opacity-30 transition-all">
            <Users className="w-5 h-5 mr-2" />
            <span>Customer</span>
          </button>
          <button className="flex items-center px-4 py-2 bg-amber-50  bg-opacity-20 rounded-lg  hover:bg-opacity-30 transition-all">
            <AlertTriangle className="w-5 h-5 mr-2" />
            <span>Alerts</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;