import { transactions } from "@/lib/data"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddTransactionSheet } from "./components/add-transaction-sheet"

export default async function TransactionsPage() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                <CardTitle>Transactions</CardTitle>
                <CardDescription>A list of all your recent transactions.</CardDescription>
            </div>
            <AddTransactionSheet />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={transactions} />
      </CardContent>
    </Card>
  )
}
