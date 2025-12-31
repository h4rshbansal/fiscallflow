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
import { Wand2 } from 'lucide-react';
import { budgetSetupAssistant } from '@/ai/flows/budget-setup-assistant';
import { useToast } from '@/hooks/use-toast';
import { budgets as initialBudgets, transactions } from '@/lib/data';

export default function BudgetSetupPage() {
  const [income, setIncome] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recommendedBudgets, setRecommendedBudgets] = useState<Record<string, number> | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleGetRecommendations = async () => {
    if (!income || !region) {
        toast({
            variant: "destructive",
            title: "Missing Information",
            description: "Please enter your income and region.",
        });
        return;
    }
    setIsLoading(true);
    setRecommendedBudgets(null);
    try {
      const result = await budgetSetupAssistant({
        income: Number(income),
        region,
      });
      setRecommendedBudgets(result.recommendedBudget);
      toast({
        title: "AI Recommendations Generated",
        description: "Here is a starting budget for you.",
      });
    } catch (error) {
      console.error('Failed to get AI recommendations:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not fetch AI recommendations. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveBudget = () => {
    // Here you would typically save the budget to your backend.
    // For now, we'll just mark setup as complete and redirect.
    localStorage.setItem('hasCompletedSetup', 'true');
    if (recommendedBudgets) {
      const newBudgets = initialBudgets.map(b => ({
        ...b,
        amount: (recommendedBudgets[b.categoryName] || b.amount / 100) * 100,
      }));
      // In a real app, you'd save `newBudgets`
      console.log("Saving budgets:", newBudgets);
    }
    toast({
      title: "Budget Saved!",
      description: "Your initial budget has been set up.",
    });
    router.push('/dashboard');
  };


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Let's set up your budget</CardTitle>
          <CardDescription>
            Tell us your monthly income and region, and our AI assistant will create a personalized budget to get you started.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="income">Monthly Income (USD)</Label>
              <Input
                id="income"
                type="number"
                placeholder="e.g., 5000"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              <Input
                id="region"
                placeholder="e.g., California, USA"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
              />
            </div>
          </div>
           <Button onClick={handleGetRecommendations} disabled={isLoading} className="w-full sm:w-auto">
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? 'Analyzing...' : 'Generate AI Budget'}
          </Button>

          {recommendedBudgets && (
             <div className="space-y-4 pt-4">
                <h3 className="text-lg font-medium">Recommended Budget</h3>
                 <div className="grid grid-cols-2 gap-4 rounded-lg border p-4 md:grid-cols-3">
                    {Object.entries(recommendedBudgets).map(([category, amount]) => (
                        <div key={category}>
                            <p className="text-sm text-muted-foreground">{category}</p>
                            <p className="text-lg font-semibold">${amount.toFixed(2)}</p>
                        </div>
                    ))}
                 </div>
             </div>
          )}
        </CardContent>
        <CardFooter>
            <Button onClick={handleSaveBudget} className="w-full" disabled={!recommendedBudgets}>
                Save Budget and Continue
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
