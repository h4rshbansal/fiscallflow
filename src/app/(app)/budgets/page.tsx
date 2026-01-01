
"use client"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { budgets as initialBudgets, transactions as initialTransactionsData } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Wand2 } from "lucide-react";
import { getBudgetRecommendations } from "@/ai/flows/budget-recommendations";
import { useToast } from "@/hooks/use-toast";
import type { Budget, Transaction } from "@/lib/types";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [recommendations, setRecommendations] = useState<Record<string, string> | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [isBudgetsDataLoaded, setIsBudgetsDataLoaded] = useState(false);

  useEffect(() => {
    const savedBudgets = localStorage.getItem('budgets');
    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    } else {
      setBudgets(initialBudgets);
    }
    setIsBudgetsDataLoaded(true);
    
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(initialTransactionsData);
    }
  }, []);

  useEffect(() => {
    if(isBudgetsDataLoaded) {
      localStorage.setItem('budgets', JSON.stringify(budgets));
    }
  }, [budgets, isBudgetsDataLoaded]);


  const handleBudgetChange = (categoryName: string, newAmount: number) => {
    setBudgets(currentBudgets => 
      currentBudgets.map(b => 
        b.categoryName === categoryName ? { ...b, amount: newAmount * 100 } : b
      )
    );
  };

  const budgetWithSpending = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.category === budget.categoryName && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { ...budget, spent, progress };
  });

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const spendingData = Object.fromEntries(
        budgetWithSpending.map(b => [b.categoryName, b.spent / 100])
      );
      const currentBudgets = Object.fromEntries(
        budgets.map(b => [b.categoryName, b.amount / 100])
      );
      const result = await getBudgetRecommendations({ spendingData, currentBudgets });
      setRecommendations(result);
      toast({
        title: "AI Recommendations Generated",
        description: "Review the suggestions from our smart assistant.",
      });
    } catch (error) {
      console.error("Failed to get AI recommendations:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not fetch AI recommendations. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">Manage your monthly spending limits.</p>
        </div>
        <Button onClick={handleGetRecommendations} disabled={isLoading}>
          <Wand2 className="mr-2 h-4 w-4" />
          {isLoading ? "Analyzing..." : "Get AI Recommendations"}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Budgets</CardTitle>
          <CardDescription>Set and track your spending for each category.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {budgetWithSpending.map(budget => (
              <div key={budget.id} className="space-y-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-medium">{budget.categoryName}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{formatCurrency(budget.spent)} of</span>
                    <Input 
                      type="number"
                      className="w-24 h-8"
                      value={budget.amount / 100}
                      onChange={(e) => handleBudgetChange(budget.categoryName, Number(e.target.value))}
                      aria-label={`${budget.categoryName} budget amount`}
                    />
                  </div>
                </div>
                <Progress value={budget.progress} />
                {recommendations?.[budget.categoryName] && (
                  <div className="flex items-start gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-900 dark:border-yellow-800/70 dark:bg-yellow-950 dark:text-yellow-200">
                    <Wand2 className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{recommendations[budget.categoryName]}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
