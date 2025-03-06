import { Wallet } from "lucide-react"

export default function WalletInfo() {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-2 flex gap-[100px] b">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2 flex" />
          Wallet Info
        </h2>
        <div>
          <p className="text-sm text-gray-600">Balance:</p>
          <hr />
          <p className="text-lg font-semibold">1,234.56 ETH</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">USD Value:</p>
          <hr />
          <p className="text-lg font-semibold">$2,345,678.90</p>
        </div>
        <a href="/airdrops">
        <h2 className="bg-blue-300 flex items-center justify-center p-4 rounded text-lg font-semibold">
          Create Airdrop
        </h2>
        </a>
      </div>
    </div>
  )
}

