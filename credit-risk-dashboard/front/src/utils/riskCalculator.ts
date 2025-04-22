import { Customer } from '../type/customer';

export const calculateRiskScore = (customer: Customer): number => {
  // Credit Score Weight: 40%
  const creditScoreWeight = 0.4;
  const normalizedCreditScore = (customer.creditScore / 850) * 100;

  // Loan Repayment History Weight: 30%
  const repaymentWeight = 0.3;
  const repaymentScore = (customer.loanRepaymentHistory.filter(x => x === 1).length / 
    customer.loanRepaymentHistory.length) * 100;

  // Loan to Income Ratio Weight: 30%
  const loanIncomeWeight = 0.3;
  const loanIncomeRatio = (customer.outstandingLoans / (customer.monthlyIncome * 12)) * 100;
  const normalizedLoanScore = Math.max(0, 100 - loanIncomeRatio);

  const finalScore = (normalizedCreditScore * creditScoreWeight) +
    (repaymentScore * repaymentWeight) +
    (normalizedLoanScore * loanIncomeWeight);

  return Math.round(finalScore);
};

export const getRiskLevel = (score: number): { level: string; color: string } => {
  if (score >= 80) return { level: 'Low Risk', color: 'bg-green-500' };
  if (score >= 60) return { level: 'Medium Risk', color: 'bg-yellow-500' };
  return { level: 'High Risk', color: 'bg-red-500' };
};