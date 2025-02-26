import { Wallet } from "lucide-react"

export default function WalletInfo() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Wallet className="w-5 h-5 mr-2" />
        Wallet Info
      </h2>
      <div className="space-y-2">
        <p className="text-sm text-gray-600">Balance:</p>
        <p className="text-2xl font-bold">1,234.56 ETH</p>
        <p className="text-sm text-gray-600">USD Value:</p>
        <p className="text-lg font-semibold">$2,345,678.90</p>
      </div>
    </div>
  )
}

