import type { LucideIcon } from "lucide-react";

export type Transaction = {
  id: string;
  date: string; // ISO string
  description: string;
  amount: number; // in cents
  category: string; // category name
  type: 'income' | 'expense';
};

export type Category = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
};

export type Budget = {
  id: string;
  categoryName: string;
  amount: number; // in cents
};

export type Goal = {
    id: string;
    name: string;
    targetAmount: number; // in cents
    currentAmount: number; // in cents
};
