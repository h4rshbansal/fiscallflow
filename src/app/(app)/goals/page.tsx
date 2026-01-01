'use client';

import { useState } from 'react';
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
import type { Goal } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Target } from 'lucide-react';
import { AddGoalDialog } from './components/add-goal-dialog';
import { AddFundsDialog } from './components/add-funds-dialog';
import { useLanguage } from '@/context/language-provider';

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isAddFundsOpen, setIsAddFundsOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAddGoal = (newGoal: Omit<Goal, 'id' | 'currentAmount'>) => {
    const goalWithId: Goal = {
      ...newGoal,
      id: `goal-${Date.now()}`,
      currentAmount: 0,
    };
    setGoals((prev) => [...prev, goalWithId]);
    toast({ title: t('goals.toasts.goal_added.title'), description: t('goals.toasts.goal_added.description') });
  };

  const handleAddFunds = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === goalId
          ? { ...g, currentAmount: g.currentAmount + amount }
          : g
      )
    );
    toast({ title: t('goals.toasts.funds_added.title'), description: t('goals.toasts.funds_added.description') });
  };

  const openAddFundsDialog = (goal: Goal) => {
    setSelectedGoal(goal);
    setIsAddFundsOpen(true);
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
            const progress = (goal.currentAmount / goal.targetAmount) * 100;
            return (
              <Card key={goal.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="space-y-1.5">
                    <CardTitle>{goal.name}</CardTitle>
                    <CardDescription>
                      {t('goals.target_label')}: {formatCurrency(goal.targetAmount)}
                    </CardDescription>
                  </div>
                  <Target className="h-6 w-6 text-muted-foreground" />
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
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => openAddFundsDialog(goal)}
                  >
                    {t('goals.add_funds_button')}
                  </Button>
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
    </div>
  );
}
