import { ArrowUpRight, ArrowDownLeft } from "lucide-react"

export default function TransactionsTable() {
  const transactions = [
    { id: 1, type: "send", amount: "10 ETH", to: "0x1234...5678", date: "2023-04-01" },
    { id: 2, type: "receive", amount: "5 ETH", from: "0x8765...4321", date: "2023-03-30" },
    { id: 3, type: "send", amount: "2 ETH", to: "0x2468...1357", date: "2023-03-28" },
    { id: 4, type: "receive", amount: "15 ETH", from: "0x1357...2468", date: "2023-03-25" },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">To/From</th>
              <th className="px-6 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="bg-white border-b">
                <td className="px-6 py-4 flex items-center">
                  {tx.type === "send" ? (
                    <ArrowUpRight className="w-4 h-4 mr-2 text-red-500" />
                  ) : (
                    <ArrowDownLeft className="w-4 h-4 mr-2 text-green-500" />
                  )}
                  {tx.type}
                </td>
                <td className="px-6 py-4">{tx.amount}</td>
                <td className="px-6 py-4">{tx.to || tx.from}</td>
                <td className="px-6 py-4">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

