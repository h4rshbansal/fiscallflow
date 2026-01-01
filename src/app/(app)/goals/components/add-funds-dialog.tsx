
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import type { Goal, Transaction } from '@/lib/types';
import { useLanguage } from '@/context/language-provider';
import { formatCurrency } from '@/lib/utils';
import { useEffect, useMemo, useState } from 'react';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
});

interface AddFundsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  goal: Goal;
  onSubmit: (goalId: string, amount: number) => void;
}

export function AddFundsDialog({
  isOpen,
  onOpenChange,
  goal,
  onSubmit,
}: AddFundsDialogProps) {
  const { t } = useLanguage();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, [isOpen]);

  const netBalance = useMemo(() => {
    if (!transactions.length) return 0;
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const totalSavings = transactions
      .filter((t) => t.type === 'saving')
      .reduce((acc, t) => acc + t.amount, 0);
    return totalIncome - totalExpenses - totalSavings;
  }, [transactions]);

  const remainingAmountForGoal = goal.targetAmount - goal.currentAmount;

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const amountInCents = values.amount * 100;
    if (amountInCents > remainingAmountForGoal) {
      form.setError('amount', {
        message: `Cannot add more than the remaining amount of ${formatCurrency(remainingAmountForGoal)}.`,
      });
      return;
    }
    onSubmit(goal.id, amountInCents);
    onOpenChange(false);
    form.reset();
  };

  const setLeftover = () => {
    const leftoverInCents = netBalance > 0 ? netBalance : 0;
    const amountToAdd = Math.min(leftoverInCents, remainingAmountForGoal);
    form.setValue('amount', amountToAdd / 100);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('goals.add_funds_dialog.title', { goalName: goal.name })}</DialogTitle>
          <DialogDescription>
            {t('goals.add_funds_dialog.description')} {formatCurrency(remainingAmountForGoal)} still needed.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('goals.add_funds_dialog.amount_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {netBalance > 0 && (
              <div className="text-sm text-muted-foreground flex justify-between items-center">
                <span>{t('goals.add_funds_dialog.leftover_balance_label')}: {formatCurrency(netBalance)}</span>
                <Button type="button" variant="link" size="sm" onClick={setLeftover} className="p-0 h-auto">
                  {t('goals.add_funds_dialog.add_leftover_button')}
                </Button>
              </div>
            )}
            <DialogFooter>
              <Button type="submit">{t('goals.add_funds_dialog.submit_button')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
