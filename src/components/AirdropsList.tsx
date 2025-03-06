import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

interface TokenDetails {
  contractAddress: string;
  name: string;
  symbol: string;
}

interface TaskDetails {
  taskId: string;
  taskName: string;
}

interface Airdrop {
  websiteUrl: string | undefined;
  airdropId: string;
  airdropName: string;
  description: string;
  airdropStartDate: string;
  airdropEndDate: string;
  totalAirdropAmount: number;
  token: TokenDetails;
  people: { twitterId: string }[]; // Store joined users
  tasks: TaskDetails[];
}

export default function AirdropsList() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);

  const twitterId = user?.sub?.split("|")[1] || "";
  const walletAddress = localStorage.getItem("pub") || "";

  const joinAirdrop = async (airdropId: string) => {
    try {
      const response = await fetch("http://localhost:5000/api/join-airdrop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ airdropId, twitterId, walletAddress }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Successfully joined the airdrop!");
        setAirdrops((prevAirdrops) =>
          prevAirdrops.map((a) =>
            a.airdropId === airdropId
              ? { ...a, people: [...a.people, { twitterId }] }
              : a
          )
        );
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error joining airdrop:", error);
      alert("Failed to join airdrop");
    }
  };

  useEffect(() => {
    const fetchAirdrops = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/show-airdrops");
        const data = await response.json();
        setAirdrops(data.airdrops);
      } catch (error) {
        console.error("Error fetching airdrops:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAirdrops();
  }, []);

  if (isLoading || loading) return <p>Loading airdrops...</p>;
  if (!isAuthenticated) return <p>Please log in to view airdrops.</p>;

  return (
    <div className="bg-white p-6 shadow-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6">Available Airdrops</h2>
      {airdrops.length === 0 ? (
        <p className="text-gray-500">No airdrops available</p>
      ) : (
        <ul className="space-y-6">
          {airdrops.map((airdrop, index) => {
            const hasJoined = airdrop.people.some((p) => p.twitterId === twitterId);
            const isEnded = new Date(airdrop.airdropEndDate) < new Date();

            return (
              <li key={index} className="border p-5 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-2">{airdrop.airdropName}</h3>
                <p className="text-sm text-gray-600 mb-3">{airdrop.description}</p>
                <hr className="mb-2" />

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">Start Date</p>
                    <p className="text-sm text-gray-700">{new Date(airdrop.airdropStartDate).toLocaleDateString()}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">End Date</p>
                    <p className="text-sm text-gray-700">{new Date(airdrop.airdropEndDate).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">Total Amount</p>
                    <p className="text-sm text-gray-700">{airdrop.totalAirdropAmount} {airdrop.token.name}</p>
                  </div>
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">Contract Address</p>
                    <p className="text-sm text-gray-700 break-all">{airdrop.token.contractAddress}</p>
                  </div>
                </div>

                {airdrop.tasks.length > 0 && (
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <p className="font-medium">Tasks To Do:</p>
                    <ul className="text-sm pl-5">
                      {airdrop.tasks.map((task, i) => (
                        <li key={i}> - {task.taskName}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <a
                    href={airdrop.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2 bg-orange-400 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Visit Website
                  </a>

                  {isEnded ? (
                    <p className="text-red-600">Ended ❌</p>
                  ) : hasJoined ? (
                    <p className="text-green-600">You have already joined this airdrop ✅</p>
                  ) : (
                    <button
                      onClick={() => joinAirdrop(airdrop.airdropId)}
                      className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Join Airdrop
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
} 