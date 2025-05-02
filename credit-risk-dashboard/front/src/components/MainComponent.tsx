import { useState, useEffect } from 'react';
import { BarChart3, DollarSign, Users, TrendingUp } from 'lucide-react';
import { Customer } from '../type/customer';
import DashboardHeader from './DashboardHeader';
import MetricsCard from './MetricsCard';
import RiskScoreChart from './RiskScoreChart';
import CustomerTable from './CustomerTable';
import MonthlyTrendsChart from './MonthlyTrendsChart';
import axios from 'axios';

const API_URL = 'https://credit-risk-financial-dashboard-2.onrender.com';

const MainComponent = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [monthlyData, setMonthlyData] = useState<Array<{
    name: string;
    income: number;
    expenses: number;
  }>>([]);
  const [metrics, setMetrics] = useState({
    customerChange: 0,
    incomeChange: 0,
    riskScoreChange: 0,
    approvalRateChange: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersResponse, monthlyDataResponse] = await Promise.all([
          axios.get(`${API_URL}/api/customers`),
          axios.get(`${API_URL}/api/monthly-trends`),
        ]);

        const customerData = Array.isArray(customersResponse.data)
          ? customersResponse.data
          : customersResponse.data.data || [];

        const mappedCustomers = customerData.map((customer: any) => ({
          customerId: customer.customerId,
          name: customer.name,
          monthlyIncome: customer.monthlyIncome,
          monthlyExpenses: customer.monthlyExpenses,
          creditScore: customer.creditScore,
          outstandingLoans: customer.outstandingLoans,
          loanRepaymentHistory: customer.loanRepaymentHistory,
          accountBalance: customer.accountBalance,
          status: customer.status as Customer['status'],
        }));

        const validMonthlyData = Array.isArray(monthlyDataResponse.data)
          ? monthlyDataResponse.data
          : [];
        setMonthlyData(validMonthlyData);

        setCustomers(mappedCustomers);
        calculateMetricsChanges(mappedCustomers);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateMetricsChanges = (currentCustomers: Customer[]) => {
    if (currentCustomers.length === 0) return;

    setMetrics({
      customerChange: Math.round((currentCustomers.length / 100 - 1) * 100),
      incomeChange: Math.round(
        (currentCustomers.reduce((sum, c) => sum + c.monthlyIncome, 0) / 10000 - 1) * 100
      ),
      riskScoreChange: Math.round(
        (currentCustomers.reduce((sum, c) => sum + c.creditScore, 0) /
          currentCustomers.length /
          700 -
          1) *
          100
      ),
      approvalRateChange: Math.round(
        (currentCustomers.filter((c) => c.status === 'Approved').length /
          currentCustomers.length -
          0.5) *
          100
      ),
    });
  };

  const handleStatusChange = async (customerId: string, newStatus: Customer['status']) => {
    try {
      await axios.patch(`${API_URL}/api/customers/${customerId}`, { status: newStatus });

      setCustomers((prevCustomers) =>
        prevCustomers.map((customer) =>
          customer.customerId === customerId
            ? { ...customer, status: newStatus }
            : customer
        )
      );
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg">
          <h2 className="text-red-800 text-lg font-semibold mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const totalIncome = customers.reduce((sum, customer) => sum + customer.monthlyIncome, 0);
  const avgRiskScore =
    customers.length > 0
      ? customers.reduce((sum, customer) => sum + customer.creditScore, 0) / customers.length
      : 0;
  const approvedCount = customers.filter((c) => c.status === 'Approved').length;
  const approvalRate =
    customers.length > 0 ? Math.round((approvedCount / customers.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <DashboardHeader />

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <MetricsCard
            title="Total Customers"
            value={customers.length}
            change={metrics.customerChange}
            icon={<Users className="w-6 h-6 text-blue-600" />}
          />
          <MetricsCard
            title="Total Monthly Income"
            value={`$${totalIncome.toLocaleString()}`}
            change={metrics.incomeChange}
            icon={<DollarSign className="w-6 h-6 text-blue-600" />}
          />
          <MetricsCard
            title="Average Risk Score"
            value={Math.round(avgRiskScore)}
            change={metrics.riskScoreChange}
            icon={<BarChart3 className="w-6 h-6 text-blue-600" />}
          />
          <MetricsCard
            title="Approval Rate"
            value={`${approvalRate}%`}
            change={metrics.approvalRateChange}
            icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <RiskScoreChart customers={customers} />
          <MonthlyTrendsChart data={monthlyData} />
        </div>

        {/* Customer Table */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Customer Overview</h3>
          <CustomerTable customers={customers} onStatusChange={handleStatusChange} />
        </div>
      </div>
    </div>
  );
};

export default MainComponent;
