

"use client";

import { useState, useEffect } from "react";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction, Category } from "@/lib/types";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AddTransactionSheet } from "./components/add-transaction-sheet";
import { useToast } from "@/hooks/use-toast";
import { DollarSign, Wallet, TrendingUp, MoreHorizontal, GraduationCap, PiggyBank } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Badge } from "@/components/ui/badge";
import { categories as initialCategories } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const TransactionCard = ({ transaction, onEdit, onDelete }: { transaction: Transaction, onEdit: (t: Transaction) => void, onDelete: (id: string) => void }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      const parsedCategories = JSON.parse(savedCategories).map((cat: any) => ({...cat, icon: GraduationCap}));
      setCategories(parsedCategories);
    } else {
      setCategories(initialCategories);
    }
  }, []);
  
  const category = categories.find(c => c.name === transaction.category);
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 space-y-1">
            <p className="font-medium text-sm">{transaction.description}</p>
            <p className="text-xs text-muted-foreground">{formatDate(new Date(transaction.date))}</p>
             {category && (
                <Badge variant="outline" style={{ borderColor: category.color, color: category.color }} className="w-min text-xs">
                  {category.name}
                </Badge>
              )}
          </div>
          <div className="flex flex-col items-end">
             <p className={`font-medium text-sm ${transaction.type === 'income' ? 'text-emerald-500' : transaction.type === 'saving' ? 'text-blue-500' : 'text-destructive'}`}>
                {transaction.type === 'income' ? '+' : '-'}
                {formatCurrency(transaction.amount)}
            </p>
             <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0 mt-1">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => onEdit(transaction)}>
                  Edit transaction
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  onClick={() => onDelete(transaction.id)}
                >
                  Delete transaction
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    } else {
      setTransactions(initialTransactions);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transactionWithId = { ...newTransaction, id: `txn-${Date.now()}`};
    setTransactions(prev => [transactionWithId, ...prev].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: "Success", description: "Transaction added successfully." });
  };
  
  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    toast({ title: "Success", description: "Transaction updated successfully." });
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    toast({
      variant: "destructive",
      title: "Deleted",
      description: "Transaction has been deleted.",
    });
  };

  const openEditSheet = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsSheetOpen(true);
  };
  
  const openAddSheet = () => {
    setEditingTransaction(null);
    setIsSheetOpen(true);
  }

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  }

  const columns = getColumns(openEditSheet, handleDeleteTransaction);

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

  return (
    <div className="space-y-6">
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expense</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalExpenses)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Savings</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalSavings)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Money Left</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                  <CardTitle>Transactions</CardTitle>
                  <CardDescription>A list of all your recent transactions.</CardDescription>
              </div>
              <div className="w-full sm:w-auto">
                <AddTransactionSheet
                    key={editingTransaction?.id}
                    isOpen={isSheetOpen}
                    onOpenChange={handleSheetOpenChange}
                    onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
                    transactionToEdit={editingTransaction}
                />
              </div>
          </div>
        </CardHeader>
        <CardContent>
          {isMobile ? (
             <div className="space-y-3">
              {transactions.map(t => (
                <TransactionCard key={t.id} transaction={t} onEdit={openEditSheet} onDelete={handleDeleteTransaction} />
              ))}
              {transactions.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                    <p>No transactions yet.</p>
                </div>
              )}
            </div>
          ) : (
            <DataTable columns={columns} data={transactions} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
