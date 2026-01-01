
"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { budgets as initialBudgets, categories as initialCategories, transactions as initialTransactions } from "@/lib/data";
import { formatCurrency, formatDate } from "@/lib/utils";
import { DollarSign, TrendingUp, Wallet, PiggyBank } from "lucide-react";
import Link from "next/link";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import type { Transaction, Category, Budget } from "@/lib/types";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : initialTransactions);

    const savedCategories = localStorage.getItem('categories');
    setCategories(savedCategories ? JSON.parse(savedCategories) : initialCategories);

    const savedBudgets = localStorage.getItem('budgets');
    setBudgets(savedBudgets ? JSON.parse(savedBudgets) : initialBudgets);
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);
  const totalSavings = transactions
    .filter((t) => t.type === 'saving')
    .reduce((acc, t) => acc + t.amount, 0);
  const netBalance = totalIncome - totalExpenses - totalSavings;

  const spendingByCategory = categories
    .filter(c => c.type === 'expense' && c.name !== 'Savings')
    .map(category => {
      const total = transactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      return { name: category.name, total: total / 100 };
    }).sort((a, b) => b.total - a.total);

  const budgetWithSpending = budgets.map(budget => {
    const spent = transactions
      .filter(t => t.category === budget.categoryName && t.type === 'expense')
      .reduce((acc, t) => acc + t.amount, 0);
    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { ...budget, spent, progress };
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Expenses</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg sm:text-2xl font-bold">{formatCurrency(totalSavings)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Net Balance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-lg sm:text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Spending Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={spendingByCategory}>
                <XAxis
                  dataKey="name"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value}`}
                />
                 <Tooltip
                    cursor={{fill: 'hsl(var(--muted))'}}
                    contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}
                  />
                <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card className="col-span-4 lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              You made {transactions.filter(t => t.type === 'expense').length} transactions this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">{transaction.description}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(new Date(transaction.date))}
                    </span>
                  </div>
                  <div className={`font-medium text-sm ${transaction.type === 'income' ? 'text-green-500' : transaction.type === 'saving' ? 'text-blue-500' : ''}`}>
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </div>
                </div>
              ))}
            </div>
             <Button asChild variant="outline" className="mt-4 w-full">
              <Link href="/transactions">View All Transactions</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Progress</CardTitle>
          <CardDescription>Your monthly budget status.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          {budgetWithSpending.map(budget => (
             <div key={budget.id} className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[1fr_100px_1fr]">
               <span className="font-medium">{budget.categoryName}</span>
               <div className="hidden text-right text-sm text-muted-foreground md:block">
                 {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
               </div>
               <Progress value={budget.progress} aria-label={`${budget.categoryName} budget progress`} />
             </div>
          ))}
           <Button asChild variant="default" className="mt-4 w-full sm:w-auto self-start">
              <Link href="/budgets">Manage Budgets</Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}
