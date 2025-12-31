"use client";

import { useState } from "react";
import { transactions as initialTransactions } from "@/lib/data";
import type { Transaction } from "@/lib/types";
import { DataTable } from "./components/data-table";
import { getColumns } from "./components/columns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTransactionSheet } from "./components/add-transaction-sheet";
import { useToast } from "@/hooks/use-toast";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    const transactionWithId = { ...newTransaction, id: `txn-${Date.now()}`};
    setTransactions(prev => [transactionWithId, ...prev]);
    toast({ title: "Success", description: "Transaction added successfully." });
  };
  
  const handleEditTransaction = (updatedTransaction: Transaction) => {
    setTransactions(prev => prev.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
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

  const handleSheetOpenChange = (open: boolean) => {
    setIsSheetOpen(open);
    if (!open) {
      setEditingTransaction(null);
    }
  }

  const columns = getColumns(openEditSheet, handleDeleteTransaction);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>A list of all your recent transactions.</CardDescription>
            </div>
            <AddTransactionSheet
              key={editingTransaction?.id} // Re-mounts the component when editing
              isOpen={isSheetOpen}
              onOpenChange={handleSheetOpenChange}
              onSubmit={editingTransaction ? handleEditTransaction : handleAddTransaction}
              transactionToEdit={editingTransaction}
            />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={transactions} />
      </CardContent>
    </Card>
  )
}
