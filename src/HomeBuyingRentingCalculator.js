import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription, CardFooter 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  calculateBuyingCosts,
  calculateRentingCosts,
  compareOptions
} from './homeCalculatorUtils';

const HomeBuyingRentingCalculator = () => {
  // Default values for buying inputs
  const [buyingInputs, setBuyingInputs] = useState({
    homePrice: 350000,
    downPayment: 70000,
    loanTermYears: 30,
    interestRate: 4.5,
    propertyTaxRate: 1.2,
    homeInsurance: 125,
    hoaFees: 50,
    maintenancePercentage: 1,
    utilityExpenses: 200,
    homeAppreciationRate: 3,
    holdingPeriodYears: 7,
    closingCostPercentage: 3,
    sellingCostPercentage: 6,
    incomeTaxRate: 22,
    opportunityCostRate: 7
  });

  // Default values for renting inputs
  const [rentingInputs, setRentingInputs] = useState({
    monthlyRent: 1800,
    rentersInsurance: 30,
    utilityExpenses: 150,
    rentIncreaseRate: 3,
    securityDeposit: 3600,
    additionalFees: 50,
    holdingPeriodYears: 7,
    opportunityCostRate: 7
  });

  // Results state
  const [buyingResults, setBuyingResults] = useState(null);
  const [rentingResults, setRentingResults] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [activeTab, setActiveTab] = useState('inputs');

  // Calculate results whenever inputs change
  useEffect(() => {
    if (buyingInputs && rentingInputs) {
      // Sync holding period between buying and renting
      if (buyingInputs.holdingPeriodYears !== rentingInputs.holdingPeriodYears) {
        setRentingInputs(prev => ({
          ...prev,
          holdingPeriodYears: buyingInputs.holdingPeriodYears
        }));
      }

      const buyResults = calculateBuyingCosts(buyingInputs);
      const rentResults = calculateRentingCosts(rentingInputs);

      setBuyingResults(buyResults);
      setRentingResults(rentResults);
      setComparison(compareOptions(buyResults, rentResults));
    }
  }, [buyingInputs, rentingInputs]);

  // Handle buying input changes
  const handleBuyingInputChange = (e) => {
    const { name, value } = e.target;
    setBuyingInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Handle renting input changes
  const handleRentingInputChange = (e) => {
    const { name, value } = e.target;
    setRentingInputs(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Home Buying vs. Renting Calculator</CardTitle>
          <CardDescription>
            Compare the true ownership costs of buying a home versus renting
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-8">
              <TabsTrigger value="inputs">Inputs</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
            </TabsList>

            {/* Inputs Tab */}
            <TabsContent value="inputs" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Buying Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Buying Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Home Price */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="homePrice">Home Price</Label>
                        <span>{formatCurrency(buyingInputs.homePrice)}</span>
                      </div>
                      <Input
                        id="homePrice"
                        name="homePrice"
                        type="number"
                        value={buyingInputs.homePrice}
                        onChange={handleBuyingInputChange}
                      />
                    </div>

                    {/* Down Payment */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="downPayment">Down Payment</Label>
                        <span>{formatCurrency(buyingInputs.downPayment)} ({((buyingInputs.downPayment / buyingInputs.homePrice) * 100).toFixed(1)}%)</span>
                      </div>
                      <Input
                        id="downPayment"
                        name="downPayment"
                        type="number"
                        value={buyingInputs.downPayment}
                        onChange={handleBuyingInputChange}
                      />
                    </div>

                    {/* Loan Term */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="loanTermYears">Loan Term (Years)</Label>
                        <span>{buyingInputs.loanTermYears} years</span>
                      </div>
                      <Slider
                        id="loanTermYears"
                        name="loanTermYears"
                        min={5}
                        max={30}
                        step={5}
                        value={[buyingInputs.loanTermYears]}
                        onValueChange={([value]) => {
                          setBuyingInputs(prev => ({
                            ...prev,
                            loanTermYears: value
                          }));
                        }}
                      />
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="interestRate">Interest Rate</Label>
                        <span>{buyingInputs.interestRate}%</span>
                      </div>
                      <Slider
                        id="interestRate"
                        name="interestRate"
                        min={1}
                        max={10}
                        step={0.1}
                        value={[buyingInputs.interestRate]}
                        onValueChange={([value]) => {
                          setBuyingInputs(prev => ({
                            ...prev,
                            interestRate: value
                          }));
                        }}
                      />
                    </div>

                    {/* Property Tax Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="propertyTaxRate">Property Tax Rate</Label>
                        <span>{buyingInputs.propertyTaxRate}%</span>
                      </div>
                      <Slider
                        id="propertyTaxRate"
                        name="propertyTaxRate
                                                  name="propertyTaxRate"
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={[buyingInputs.propertyTaxRate]}
                        onValueChange={([value]) => {
                          setBuyingInputs(prev => ({
                            ...prev,
                            propertyTaxRate: value
                          }));
                        }}
                      />
                    </div>

                    {/* Home Insurance */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="homeInsurance">Home Insurance (Monthly)</Label>
                        <span>{formatCurrency(buyingInputs.homeInsurance)}</span>
                      </div>
                      <Input
                        id="homeInsurance"
                        name="homeInsurance"
                        type="number"
                        value={buyingInputs.homeInsurance}
                        onChange={handleBuyingInputChange}
                      />
                    </div>

                    {/* HOA Fees */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="hoaFees">HOA Fees (Monthly)</Label>
                        <span>{formatCurrency(buyingInputs.hoaFees)}</span>
                      </div>
                      <Input
                        id="hoaFees"
                        name="hoaFees"
                        type="number"
                        value={buyingInputs.hoaFees}
                        onChange={handleBuyingInputChange}
                      />
                    </div>

                    {/* Maintenance Percentage */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="maintenancePercentage">Annual Maintenance (%)</Label>
                        <span>{buyingInputs.maintenancePercentage}%</span>
                      </div>
                      <Slider
                        id="maintenancePercentage"
                        name="maintenancePercentage"
                        min={0.1}
                        max={5}
                        step={0.1}
                        value={[buyingInputs.maintenancePercentage]}
                        onValueChange={([value]) => {
                          setBuyingInputs(prev => ({
                            ...prev,
                            maintenancePercentage: value
                          }));
                        }}
                      />
                    </div>

                    {/* Utilities */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="utilityExpenses">Utility Expenses (Monthly)</Label>
                        <span>{formatCurrency(buyingInputs.utilityExpenses)}</span>
                      </div>
                      <Input
                        id="utilityExpenses"
                        name="utilityExpenses"
                        type="number"
                        value={buyingInputs.utilityExpenses}
                        onChange={handleBuyingInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Renting Inputs */}
                <Card>
                  <CardHeader>
                    <CardTitle>Renting Inputs</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Monthly Rent */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="monthlyRent">Monthly Rent</Label>
                        <span>{formatCurrency(rentingInputs.monthlyRent)}</span>
                      </div>
                      <Input
                        id="monthlyRent"
                        name="monthlyRent"
                        type="number"
                        value={rentingInputs.monthlyRent}
                        onChange={handleRentingInputChange}
                      />
                    </div>

                    {/* Renters Insurance */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="rentersInsurance">Renters Insurance (Monthly)</Label>
                        <span>{formatCurrency(rentingInputs.rentersInsurance)}</span>
                      </div>
                      <Input
                        id="rentersInsurance"
                        name="rentersInsurance"
                        type="number"
                        value={rentingInputs.rentersInsurance}
                        onChange={handleRentingInputChange}
                      />
                    </div>

                    {/* Utilities */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="rentUtilityExpenses">Utility Expenses (Monthly)</Label>
                        <span>{formatCurrency(rentingInputs.utilityExpenses)}</span>
                      </div>
                      <Input
                        id="rentUtilityExpenses"
                        name="utilityExpenses"
                        type="number"
                        value={rentingInputs.utilityExpenses}
                        onChange={handleRentingInputChange}
                      />
                    </div>

                    {/* Rent Increase Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="rentIncreaseRate">Annual Rent Increase</Label>
                        <span>{rentingInputs.rentIncreaseRate}%</span>
                      </div>
                      <Slider
                        id="rentIncreaseRate"
                        name="rentIncreaseRate"
                        min={0}
                        max={10}
                        step={0.5}
                        value={[rentingInputs.rentIncreaseRate]}
                        onValueChange={([value]) => {
                          setRentingInputs(prev => ({
                            ...prev,
                            rentIncreaseRate: value
                          }));
                        }}
                      />
                    </div>

                    {/* Security Deposit */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="securityDeposit">Security Deposit</Label>
                        <span>{formatCurrency(rentingInputs.securityDeposit)}</span>
                      </div>
                      <Input
                        id="securityDeposit"
                        name="securityDeposit"
                        type="number"
                        value={rentingInputs.securityDeposit}
                        onChange={handleRentingInputChange}
                      />
                    </div>

                    {/* Additional Fees */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="additionalFees">Additional Fees (Monthly)</Label>
                        <span>{formatCurrency(rentingInputs.additionalFees)}</span>
                      </div>
                      <Input
                        id="additionalFees"
                        name="additionalFees"
                        type="number"
                        value={rentingInputs.additionalFees}
                        onChange={handleRentingInputChange}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Shared Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle>Shared Inputs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Holding Period */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="holdingPeriodYears">Holding Period (Years)</Label>
                        <span>{buyingInputs.holdingPeriodYears} years</span>
                      </div>
                      <Slider
                        id="holdingPeriodYears"
                        name="holdingPeriodYears"
                        min={1}
                        max={30}
                        step={1}
                        value={[buyingInputs.holdingPeriodYears]}
                        onValueChange={([value]) => {
                          setBuyingInputs(prev => ({
                            ...prev,
                            holdingPeriodYears: value
                          }));
                          setRentingInputs(prev => ({
                            ...prev,
                            holdingPeriodYears: value
                          }));
                        }}
                      />
                    </div>

                    {/* Opportunity Cost Rate */}
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="opportunityCostRate">Investment Return Rate</Label>
                        <span>{buyingInputs.opportunityCostRate}%</span>
                      </div>
                      <Slider
                        id="opportunityCostRate"
                        name="opportunityCostRate"
                        min={1}
                        max={15}
                        step={0.5}
                        value={[buyingInputs.opportunityCostRate]}
                        onValueChange={([value]) => {
                          setBuyingInputs(prev => ({
                            ...prev,
                            opportunityCostRate: value
                          }));
                          setRentingInputs(prev => ({
                            ...prev,
                            opportunityCostRate: value
                          }));
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Results Tab */}
            <TabsContent value="results">
              {buyingResults && rentingResults && comparison && (
                <div className="space-y-8">
                  {/* Summary Card */}
                  <Card className={comparison.isBuyingCheaper ? "border-green-500" : comparison.isRentingCheaper ? "border-blue-500" : "border-gray-500"}>
                    <CardHeader>
                      <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xl font-bold mb-4">{comparison.recommendation}</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <div className="text-lg font-semibold mb-2">Total Cost of Buying</div>
                          <div className="text-2xl font-bold">{formatCurrency(comparison.buyingTotal)}</div>
                          <div className="text-sm text-gray-500">Over {buyingInputs.holdingPeriodYears} years</div>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg">
                          <div className="text-lg font-semibold mb-2">Total Cost of Renting</div>
                          <div className="text-2xl font-bold">{formatCurrency(comparison.rentingTotal)}</div>
                          <div className="text-sm text-gray-500">Over {rentingInputs.holdingPeriodYears} years</div>
                        </div>
                      </div>
                    </Card
                      </div>
                    </CardContent>
                  </Card>

                  {/* Detailed Results */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Buying Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Buying Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-semibold">Monthly Mortgage</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyMortgage)}</div>

                          <div className="font-semibold">Monthly Property Tax</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyPropertyTax)}</div>

                          <div className="font-semibold">Monthly Insurance</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyInsurance)}</div>

                          <div className="font-semibold">Monthly HOA</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyHOA)}</div>

                          <div className="font-semibold">Monthly Maintenance</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyMaintenance)}</div>

                          <div className="font-semibold">Monthly Utilities</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyUtilities)}</div>

                          <div className="font-semibold border-t pt-2">Total Monthly Payment</div>
                          <div className="text-right font-bold border-t pt-2">{formatCurrency(buyingResults.totalMonthlyPayment)}</div>

                          <div className="font-semibold mt-4">Initial Investment</div>
                          <div className="text-right mt-4">{formatCurrency(buyingResults.initialInvestment)}</div>

                          <div className="font-semibold">Future Home Value</div>
                          <div className="text-right">{formatCurrency(buyingResults.futureHomeValue)}</div>

                          <div className="font-semibold">Remaining Loan Balance</div>
                          <div className="text-right">{formatCurrency(buyingResults.remainingBalance)}</div>

                          <div className="font-semibold">Total Principal Paid</div>
                          <div className="text-right">{formatCurrency(buyingResults.totalPrincipalPaid)}</div>

                          <div className="font-semibold">Total Interest Paid</div>
                          <div className="text-right">{formatCurrency(buyingResults.totalInterestPaid)}</div>

                          <div className="font-semibold">Tax Savings</div>
                          <div className="text-right">{formatCurrency(buyingResults.totalTaxSavings)}</div>

                          <div className="font-semibold">Opportunity Cost</div>
                          <div className="text-right">{formatCurrency(buyingResults.opportunityCost)}</div>

                          <div className="font-semibold">Equity Gain</div>
                          <div className="text-right">{formatCurrency(buyingResults.equityGain)}</div>

                          <div className="font-semibold">Net Proceeds From Sale</div>
                          <div className="text-right">{formatCurrency(buyingResults.netProceedsFromSale)}</div>

                          <div className="font-semibold border-t pt-2">Total Cost of Owning</div>
                          <div className="text-right font-bold border-t pt-2">{formatCurrency(buyingResults.totalCostOfOwning)}</div>

                          <div className="font-semibold">Monthly Cost of Owning</div>
                          <div className="text-right">{formatCurrency(buyingResults.monthlyCostOfOwning)}</div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Renting Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Renting Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-semibold">Average Monthly Rent</div>
                          <div className="text-right">{formatCurrency(rentingResults.averageMonthlyRent)}</div>

                          <div className="font-semibold">Monthly Insurance</div>
                          <div className="text-right">{formatCurrency(rentingResults.monthlyInsurance)}</div>

                          <div className="font-semibold">Monthly Utilities</div>
                          <div className="text-right">{formatCurrency(rentingResults.monthlyUtilities)}</div>

                          <div className="font-semibold">Monthly Additional Fees</div>
                          <div className="text-right">{formatCurrency(rentingResults.monthlyAdditionalFees)}</div>

                          <div className="font-semibold mt-4">Initial Costs</div>
                          <div className="text-right mt-4">{formatCurrency(rentingResults.initialCosts)}</div>

                          <div className="font-semibold">Total Rent Paid</div>
                          <div className="text-right">{formatCurrency(rentingResults.totalRent)}</div>

                          <div className="font-semibold">Total Utilities Paid</div>
                          <div className="text-right">{formatCurrency(rentingResults.totalUtilities)}</div>

                          <div className="font-semibold">Total Insurance Paid</div>
                          <div className="text-right">{formatCurrency(rentingResults.totalInsurance)}</div>

                          <div className="font-semibold">Total Additional Fees</div>
                          <div className="text-right">{formatCurrency(rentingResults.totalAdditionalFees)}</div>

                          <div className="font-semibold">Deposit Returned</div>
                          <div className="text-right">{formatCurrency(rentingResults.depositReturned)}</div>

                          <div className="font-semibold">Opportunity Cost</div>
                          <div className="text-right">{formatCurrency(rentingResults.opportunityCost)}</div>

                          <div className="font-semibold border-t pt-2">Total Cost of Renting</div>
                          <div className="text-right font-bold border-t pt-2">{formatCurrency(rentingResults.totalCostOfRenting)}</div>

                          <div className="font-semibold">Monthly Cost of Renting</div>
                          <div className="text-right">{formatCurrency(rentingResults.monthlyCostOfRenting)}</div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Print functionality could be added here
                        window.print();
                      }}
                    >
                      Print Results
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Email functionality could be implemented in a real app
                        // This would typically connect to a backend service
                        alert("Email functionality would be implemented here");
                      }}
                    >
                      Email Results
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => {
                        // Save functionality could be implemented in a real app
                        // This would typically connect to a user account system
                        alert("Save functionality would be implemented here");
                      }}
                    >
                      Save Results
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>

        <CardFooter className="flex flex-col items-start space-y-2 text-sm text-gray-500">
          <p>Note: This calculator provides estimates based on the information you provide and makes some assumptions about future costs.</p>
          <p>Results are for informational purposes only and do not constitute financial advice.</p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HomeBuyingRentingCalculator;
