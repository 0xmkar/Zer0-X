import { Gift } from "lucide-react"

export default function AirdropsList() {
  const airdrops = [
    { id: 1, name: "Token A", amount: "100" },
    { id: 2, name: "Token B", amount: "500" },
    { id: 3, name: "Token C", amount: "250" },
  ]

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Gift className="w-5 h-5 mr-2" />
        Available Airdrops
      </h2>
      <ul className="space-y-2">
        {airdrops.map((airdrop) => (
          <li key={airdrop.id} className="flex justify-between items-center">
            <span>{airdrop.name}</span>
            <span className="font-semibold">{airdrop.amount}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

