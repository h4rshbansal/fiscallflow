
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { budgets as initialBudgets, categories as initialCategories } from '@/lib/data';
import { formatCurrency } from '@/lib/utils';
import type { Transaction } from '@/lib/types';


export default function BudgetSetupPage() {
  const [step, setStep] = useState(1);
  const [salary, setSalary] = useState('');
  const [budgets, setBudgets] = useState<Record<string, string>>(
    Object.fromEntries(initialCategories.filter(c => c.name !== 'Salary').map(c => [c.name, '0']))
  );
  const router = useRouter();
  const { toast } = useToast();

  const totalAllocated = Object.values(budgets).reduce((sum, amount) => sum + Number(amount), 0);
  const remainingSalary = Number(salary) - totalAllocated;

  const handleSkip = () => {
    localStorage.setItem('hasCompletedSetup', 'true');
    router.push('/dashboard');
  };

  const handleNext = () => {
    // Add salary as an income transaction
    const newTransaction: Transaction = {
      id: `txn-${Date.now()}`,
      date: new Date().toISOString(),
      description: 'Monthly Salary',
      amount: Number(salary) * 100, // in cents
      category: 'Salary',
      type: 'income',
    };
    
    const existingTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    localStorage.setItem('transactions', JSON.stringify([newTransaction, ...existingTransactions]));
    
    setStep(2);
  };

  const handleSaveBudget = () => {
    if (remainingSalary < 0) {
      toast({
        variant: 'destructive',
        title: 'Overbudget!',
        description: 'Your allocated budget exceeds your salary. Please adjust the amounts.',
      });
      return;
    }
    
    const formattedBudgets = Object.entries(budgets).map(([categoryName, amount]) => ({
      id: `bud-${categoryName}-${Date.now()}`,
      categoryName,
      amount: Number(amount) * 100, // to cents
    }));
    
    localStorage.setItem('budgets', JSON.stringify(formattedBudgets));
    localStorage.setItem('hasCompletedSetup', 'true');

    toast({
      title: "Budget Saved!",
      description: "Your initial budget has been set up.",
    });
    router.push('/dashboard');
  };

  const handleBudgetChange = (category: string, value: string) => {
    setBudgets(prev => ({ ...prev, [category]: value }));
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Set up your budget</CardTitle>
          <CardDescription>
            {step === 1 ? "First, let's start with your monthly salary." : "Now, allocate your salary across your spending categories."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Monthly Salary (INR)</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="e.g., 50000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
                <div className="rounded-lg border bg-card-foreground/5 p-4">
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total Salary:</span>
                        <span>{formatCurrency(Number(salary) * 100)}</span>
                    </div>
                    <div className="flex justify-between text-base text-muted-foreground">
                        <span>Allocated:</span>
                        <span>{formatCurrency(totalAllocated * 100)}</span>
                    </div>
                     <div className={`flex justify-between text-base font-medium ${remainingSalary < 0 ? 'text-destructive' : 'text-green-600'}`}>
                        <span>Remaining:</span>
                        <span>{formatCurrency(remainingSalary * 100)}</span>
                    </div>
                </div>

              <div className="flex flex-wrap gap-4">
                {Object.keys(budgets).map(category => (
                  <div key={category} className="flex-grow space-y-2" style={{minWidth: 'calc(50% - 0.5rem)'}}>
                    <Label htmlFor={`budget-${category}`}>{category}</Label>
                    <Input
                      id={`budget-${category}`}
                      type="number"
                      placeholder="0.00"
                      value={budgets[category]}
                      onChange={(e) => handleBudgetChange(category, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
           <Button variant="link" className="p-0" onClick={handleSkip}>
              Skip for now
            </Button>
          <div className="flex justify-end gap-4">
            {step === 2 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                  Back
              </Button>
            )}
            {step === 1 ? (
              <Button onClick={handleNext} disabled={!salary || Number(salary) <= 0}>
                  Next
              </Button>
            ) : (
              <Button onClick={handleSaveBudget}>
                  Save Budget and Continue
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
