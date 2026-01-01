
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
import type { Goal } from '@/lib/types';
import { useLanguage } from '@/context/language-provider';
import { formatCurrency } from '@/lib/utils';

const formSchema = z.object({
  amount: z.coerce.number().positive({ message: 'Amount must be positive.' }),
});

interface RemoveFundsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  goal: Goal;
  onSubmit: (goalId: string, amount: number) => void;
}

export function RemoveFundsDialog({
  isOpen,
  onOpenChange,
  goal,
  onSubmit,
}: RemoveFundsDialogProps) {
  const { t } = useLanguage();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    const amountInCents = values.amount * 100;
    if (amountInCents > goal.currentAmount) {
        form.setError('amount', { message: t('goals.remove_funds_dialog.error_insufficient_funds') });
        return;
    }
    onSubmit(goal.id, amountInCents);
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('goals.remove_funds_dialog.title', { goalName: goal.name })}</DialogTitle>
          <DialogDescription>
            {t('goals.remove_funds_dialog.description', { currentAmount: formatCurrency(goal.currentAmount) })}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('goals.remove_funds_dialog.amount_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" variant="destructive">{t('goals.remove_funds_dialog.submit_button')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
