
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/lib/utils';
import { goals as initialGoals } from '@/lib/goals-data';
import type { Goal, Transaction } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Target, CheckCircle2 } from 'lucide-react';
import { AddGoalDialog } from './components/add-goal-dialog';
import { AddFundsDialog } from './components/add-funds-dialog';
import { RemoveFundsDialog } from './components/remove-funds-dialog';
import { useLanguage } from '@/context/language-provider';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [isRemoveFundsOpen, setIsRemoveFundsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isGoalsDataLoaded, setIsGoalsDataLoaded] = useState(false);
  const [isTransactionsDataLoaded, setIsTransactionsDataLoaded] = useState(false);

  useEffect(() => {
    const savedGoals = localStorage.getItem('goals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    } else {
      setGoals(initialGoals);
    }
    setIsGoalsDataLoaded(true);
    
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
    setIsTransactionsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isGoalsDataLoaded) {
       localStorage.setItem('goals', JSON.stringify(goals));
    }
  }, [goals, isGoalsDataLoaded]);

  useEffect(() => {
    if (isTransactionsDataLoaded) {
       localStorage.setItem('transactions', JSON.stringify(transactions));
    }
  }, [transactions, isTransactionsDataLoaded]);

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'currentAmount' | 'status'>) => {
    const goalWithId: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      currentAmount: 0,
      status: 'in-progress'
    };
    setGoals((prev) => [...prev, goalWithId]);
    toast({ title: t('goals.toasts.goal_added.title'), description: t('goals.toasts.goal_added.description') });
  };

  const handleAddFunds = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + amount }
          : g
      )
    );

    const newTransaction: Transaction = {
      id: `txn-goal-add-${Date.now()}`,
      date: new Date().toISOString(),
      description: `Contribution to "${goal.name}"`,
      amount: amount,
      category: 'Savings',
      type: 'saving'
    };
    setTransactions(prev => [newTransaction, ...prev]);

    toast({ title: t('goals.toasts.funds_added.title'), description: t('goals.toasts.funds_added.description') });
  };
  
  const handleRemoveFunds = (goalId: string, amount: number) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;

    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount - amount }
          : g
      )
    );
    
    const newTransaction: Transaction = {
      id: `txn-goal-remove-${Date.now()}`,
      date: new Date().toISOString(),
      description: `Withdrawal from "${goal.name}"`,
      amount: amount,
      category: 'Other',
      type: 'income'
    };
    setTransactions(prev => [newTransaction, ...prev]);

    toast({ title: t('goals.toasts.funds_removed.title'), description: t('goals.toasts.funds_removed.description') });
  };

  const handleMarkAsAchieved = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId ? { ...g, status: 'achieved' } : g
      )
    );
    toast({ title: t('goals.toasts.goal_achieved.title'), description: t('goals.toasts.goal_achieved.description') });
  }

  const openAddFundsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddFundsOpen(true);
  };
  
  const openRemoveFundsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsRemoveFundsOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t('goals.title')}</h1>
          <p className="text-muted-foreground">
            {t('goals.description')}
          </p>
        </div>
        <Button onClick={() => setIsAddGoalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('goals.add_goal_button')}
        </Button>
      </div>

      {goals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => {
            const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
            const isAchieved = goal.status === 'achieved';
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <Card key={goal.id} className={isAchieved ? "bg-green-100/10 border-green-500/30" : ""}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="space-y-1.5">
                    <CardTitle className={isAchieved ? "text-green-400" : ""}>{goal.name}</CardTitle>
                    <CardDescription>
                      {t('goals.target_label')}: {formatCurrency(goal.targetAmount)}
                    </CardDescription>
                  </div>
                  {isAchieved ? (
                     <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <Target className="h-6 w-6 text-muted-foreground" />
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">
                        {formatCurrency(goal.currentAmount)}
                      </span>
                      <span className="text-muted-foreground">{progress.toFixed(0)}%</span>
                    </div>
                  </div>
                  
                  {isAchieved ? (
                     <p className="text-sm text-green-500 text-center font-medium">Goal Achieved!</p>
                  ): isCompleted ? (
                    <div className="flex flex-col gap-2">
                        <Button
                            variant="default"
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleMarkAsAchieved(goal.id)}
                        >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            {t('goals.mark_achieved_button')}
                        </Button>
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => openRemoveFundsDialog(goal)}
                            disabled={goal.currentAmount === 0}
                        >
                            {t('goals.remove_funds_button')}
                        </Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                        <Button
                            variant="secondary"
                            className="w-full"
                            onClick={() => openRemoveFundsDialog(goal)}
                            disabled={goal.currentAmount === 0}
                        >
                            {t('goals.remove_funds_button')}
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => openAddFundsDialog(goal)}
                        >
                            {t('goals.add_funds_button')}
                        </Button>
                    </div>
                  )}

                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="flex flex-col items-center justify-center py-20">
            <CardContent className='flex flex-col items-center justify-center'>
                <Target className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">{t('goals.empty_state.title')}</h3>
                <p className="text-muted-foreground mb-6 text-center">
                    {t('goals.empty_state.description')}
                </p>
                <Button onClick={() => setIsAddGoalOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {t('goals.create_first_goal_button')}
                </Button>
            </CardContent>
        </Card>
      )}

      <AddGoalDialog
        isOpen={isAddGoalOpen}
        onOpenChange={setIsAddGoalOpen}
        onSubmit={handleAddGoal}
      />

      {selectedGoal && (
        <AddFundsDialog
          isOpen={isAddFundsOpen}
          onOpenChange={setIsAddFundsOpen}
          goal={selectedGoal}
          onSubmit={handleAddFunds}
        />
      )}
      
      {selectedGoal && (
        <RemoveFundsDialog
          isOpen={isRemoveFundsOpen}
          onOpenChange={setIsRemoveFundsOpen}
          goal={selectedGoal}
          onSubmit={handleRemoveFunds}
        />
      )}
    </div>
  );
}
