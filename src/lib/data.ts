import type { Transaction, Category, Budget } from './types';
import {
  Home,
  ShoppingCart,
  Car,
  Heart,
  Film,
  Utensils,
  Landmark,
  PiggyBank,
  Briefcase,
  GraduationCap
} from 'lucide-react';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Housing', icon: Home, color: 'hsl(var(--chart-1))' },
  { id: 'cat-2', name: 'Groceries', icon: ShoppingCart, color: 'hsl(var(--chart-2))' },
  { id: 'cat-3', name: 'Transportation', icon: Car, color: 'hsl(var(--chart-3))' },
  { id: 'cat-4', name: 'Healthcare', icon: Heart, color: 'hsl(var(--chart-4))' },
  { id: 'cat-5', name: 'Entertainment', icon: Film, color: 'hsl(var(--chart-5))' },
  { id: 'cat-6', name: 'Food', icon: Utensils, color: 'hsl(var(--chart-1))' },
  { id: 'cat-7', name: 'Utilities', icon: Landmark, color: 'hsl(var(--chart-2))' },
  { id: 'cat-8', name: 'Savings', icon: PiggyBank, color: 'hsl(var(--chart-3))' },
  { id: 'cat-9', name: 'Salary', icon: Briefcase, color: 'hsl(var(--chart-4))' },
  { id: 'cat-10', name: 'Other', icon: GraduationCap, color: 'hsl(var(--chart-5))' },
];

export const transactions: Transaction[] = [
  { id: 'txn-1', date: '2024-07-01T00:00:00.000Z', description: 'Monthly Rent', amount: 150000, category: 'Housing', type: 'expense' },
  { id: 'txn-2', date: '2024-07-01T00:00:00.000Z', description: 'Gas Bill', amount: 7500, category: 'Utilities', type: 'expense' },
  { id: 'txn-3', date: '2024-07-02T00:00:00.000Z', description: 'Trader Joe\'s', amount: 12050, category: 'Groceries', type: 'expense' },
  { id: 'txn-4', date: '2024-07-03T00:00:00.000Z', description: 'Gasoline', amount: 5500, category: 'Transportation', type: 'expense' },
  { id: 'txn-5', date: '2024-07-05T00:00:00.000Z', description: 'Monthly Salary', amount: 500000, category: 'Salary', type: 'income' },
  { id: 'txn-6', date: '2024-07-05T00:00:00.000Z', description: 'Starbucks', amount: 575, category: 'Food', type: 'expense' },
  { id: 'txn-7', date: '2024-07-06T00:00:00.000Z', description: 'Movie Tickets', amount: 3000, category: 'Entertainment', type: 'expense' },
  { id: 'txn-8', date: '2024-07-08T00:00:00.000Z', description: 'Pharmacy', amount: 2500, category: 'Healthcare', type: 'expense' },
  { id: 'txn-9', date: '2024-07-10T00:00:00.000Z', description: 'Dinner with friends', amount: 8000, category: 'Food', type: 'expense' },
  { id: 'txn-10', date: '2024-07-12T00:00:00.000Z', description: 'Whole Foods', amount: 9500, category: 'Groceries', type: 'expense' },
  { id: 'txn-11', date: '2024-07-15T00:00:00.000Z', description: 'Transfer to Savings', amount: 100000, category: 'Savings', type: 'expense' },
  { id: 'txn-12', date: '2024-07-18T00:00:00.000Z', description: 'Spotify Subscription', amount: 1099, category: 'Entertainment', type: 'expense' },
  { id: 'txn-13', date: '2024-07-20T00:00:00.000Z', description: 'New Shoes', amount: 12000, category: 'Other', type: 'expense' },
];

export const budgets: Budget[] = [
  { id: 'bud-1', categoryName: 'Housing', amount: 150000 },
  { id: 'bud-2', categoryName: 'Groceries', amount: 40000 },
  { id: 'bud-3', categoryName: 'Transportation', amount: 15000 },
  { id: 'bud-4', categoryName: 'Healthcare', amount: 10000 },
  { id: 'bud-5', categoryName: 'Entertainment', amount: 10000 },
  { id: 'bud-6', categoryName: 'Food', amount: 20000 },
  { id: 'bud-7', categoryName: 'Utilities', amount: 10000 },
  { id: 'bud-8', categoryName: 'Savings', amount: 100000 },
  { id: 'bud-9', categoryName: 'Other', amount: 5000 },
];
