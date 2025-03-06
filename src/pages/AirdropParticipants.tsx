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
  people: {
    twitterId: string 
    walletAddress: string;
}[]; // Store joined users
  tasks: TaskDetails[];
}

export default function AirdropParticipants() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [airdrops, setAirdrops] = useState<Airdrop[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAirdropClosed, setIsAirdropClosed] = useState(false); // Track if the last airdrop is closed


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
    <div className="bg-white p-6 shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-6">Airdrop Participants</h2>
      <ul className="space-y-6">
        {airdrops
          .filter((airdrop) => airdrop.people.length > 0) // Only show airdrops with participants
          .map((airdrop, index, filteredAirdrops) => {
            const isLastAirdrop = index === filteredAirdrops.length - 1;

            return (
              <li key={airdrop.airdropId} className="bg-gray-100 p-3 rounded-lg">
                <p className="font-medium">Airdrop: {airdrop.airdropName}</p>
                <p className="font-medium">Participants:</p>
                <ul className="text-sm pl-5 list-decimal">
                  {airdrop.people.map((person, i) => (
                    <li key={i}>
                      {person.twitterId} : {person.walletAddress}
                    </li>
                  ))}
                </ul>

                {/* Show "End Airdrop" button only for the last airdrop */}
                {isLastAirdrop &&
                  (isAirdropClosed ? (
                    <p className="mt-4 text-red-500 font-medium">Airdrop has closed.</p>
                  ) : (
                    <button
                      className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                      onClick={() => setIsAirdropClosed(true)}
                    >
                      End Airdrop
                    </button>
                  ))}
              </li>
            );
          })}
      </ul>
    </div>
  );
} 