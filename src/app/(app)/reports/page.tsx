
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { transactions as initialTransactions, categories as initialCategories } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";
import { Bar, BarChart, CartesianGrid, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, Cell } from "recharts";
import { subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Transaction, Category } from "@/lib/types";
import { GraduationCap } from 'lucide-react';

const dateRanges = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'last-3-months', label: 'Last 3 Months' },
];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('this-month');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    setTransactions(savedTransactions ? JSON.parse(savedTransactions) : initialTransactions);

    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories).map((cat: any) => ({...cat, icon: GraduationCap}));
      setAllCategories(parsedCategories);
    } else {
      setAllCategories(initialCategories);
    }
  }, []);

  const getFilteredTransactions = () => {
    const now = new Date();
    let startDate;

    switch (dateRange) {
      case 'last-month':
        startDate = startOfMonth(subMonths(now, 1));
        const endDate = endOfMonth(subMonths(now, 1));
        return transactions.filter(t => new Date(t.date) >= startDate && new Date(t.date) <= endDate);
      case 'last-3-months':
        startDate = startOfMonth(subMonths(now, 2));
        return transactions.filter(t => new Date(t.date) >= startDate);
      case 'this-month':
      default:
        startDate = startOfMonth(now);
        return transactions.filter(t => new Date(t.date) >= startDate);
    }
  };

  const filteredTransactions = getFilteredTransactions();

  const spendingByCategory = allCategories
    .filter(c => c.type === 'expense')
    .map(category => {
      const total = filteredTransactions
        .filter(t => t.category === category.name && t.type === 'expense')
        .reduce((acc, t) => acc + t.amount, 0);
      return { name: category.name, value: total / 100, color: category.color };
    })
    .filter(c => c.value > 0)
    .sort((a, b) => b.value - a.value);
  
  const incomeVsExpense = [
    { name: 'Income', value: filteredTransactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0) / 100 },
    { name: 'Expense', value: filteredTransactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0) / 100 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">Analyze your spending habits over time.</p>
        </div>
        <div className="w-full md:w-auto">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {dateRanges.map(range => (
                <SelectItem key={range.value} value={range.value}>{range.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
            <CardDescription>Breakdown of your expenses for the selected period.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={spendingByCategory} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => formatCurrency(value * 100)} />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }}/>
                <Tooltip formatter={(value: number) => formatCurrency(value * 100)} />
                <Bar dataKey="value" fill="hsl(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Percentage of spending per category.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie data={spendingByCategory} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                        {spendingByCategory.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value * 100)} />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

       <Card>
          <CardHeader>
            <CardTitle>Income vs. Expense</CardTitle>
            <CardDescription>Comparison of total income and expenses.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={incomeVsExpense}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => formatCurrency(value * 100)} />
                <Tooltip formatter={(value: number) => formatCurrency(value * 100)} />
                <Legend />
                <Bar dataKey="value" fill="hsl(var(--primary))">
                    <Cell fill={"hsl(var(--chart-2))"} />
                    <Cell fill={"hsl(var(--destructive))"} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
    </div>
  );
}
