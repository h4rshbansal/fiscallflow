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

export const transactions: Transaction[] = [];

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
