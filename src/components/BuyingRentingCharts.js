import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const BuyingRentingCharts = ({ buyingResults, rentingResults, buyingInputs, rentingInputs }) => {
  if (!buyingResults || !rentingResults) return null;

  // Prepare monthly cost comparison data
  const monthlyComparisonData = [
    { name: 'Monthly Payment', Buying: buyingResults.totalMonthlyPayment, Renting: rentingResults.averageMonthlyRent + rentingResults.monthlyInsurance + rentingResults.monthlyUtilities + rentingResults.monthlyAdditionalFees },
  ];

  // Prepare buying cost breakdown data
  const buyingBreakdownData = [
    { name: 'Mortgage', value: buyingResults.monthlyMortgage },
    { name: 'Property Tax', value: buyingResults.monthlyPropertyTax },
    { name: 'Insurance', value: buyingResults.monthlyInsurance },
    { name: 'HOA', value: buyingResults.monthlyHOA },
    { name: 'Maintenance', value: buyingResults.monthlyMaintenance },
    { name: 'Utilities', value: buyingResults.monthlyUtilities }
  ];

  // Prepare renting cost breakdown data
  const rentingBreakdownData = [
    { name: 'Rent', value: rentingResults.averageMonthlyRent },
    { name: 'Insurance', value: rentingResults.monthlyInsurance },
    { name: 'Utilities', value: rentingResults.monthlyUtilities },
    { name: 'Additional Fees', value: rentingResults.monthlyAdditionalFees }
  ];

  // Year-by-year comparison data
  const yearlyComparisonData = Array.from({ length: buyingInputs.h
  // Year-by-year comparison data
  const yearlyComparisonData = Array.from({ length: buyingInputs.holdingPeriodYears }, (_, i) => {
    const year = i + 1;

    // Calculate cumulative rent with annual increases
    let cumulativeRent = 0;
    let currentMonthlyRent = rentingInputs.monthlyRent;

    for (let y = 0; y < year; y++) {
      if (y > 0) {
        currentMonthlyRent *= (1 + (rentingInputs.rentIncreaseRate / 100));
      }
      cumulativeRent += currentMonthlyRent * 12;
    }

    // Add other costs for renting
    const totalRentingCost = cumulativeRent + 
      (rentingInputs.rentersInsurance + rentingInputs.utilityExpenses + rentingInputs.additionalFees) * 12 * year;

    // Calculate cumulative buying costs
    const totalBuyingCost = buyingResults.totalMonthlyPayment * 12 * year;

    return {
      year,
      Buying: totalBuyingCost,
      Renting: totalRentingCost
    };
  });

  return (
    <div className="charts-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyComparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Buying" fill="#8884d8" />
          <Bar dataKey="Renting" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={buyingBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} fill="#8884d8">
            {buyingBreakdownData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Pie data={rentingBreakdownData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={70} outerRadius={90} fill="#82ca9d" label>
            {rentingBreakdownData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={yearlyComparisonData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Buying" fill="#8884d8" />
          <Bar dataKey="Renting" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BuyingRentingCharts;
