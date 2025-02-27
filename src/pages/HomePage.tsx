import WalletInfo from "../components/WalletInfo";
import AirdropsList from "../components/AirdropsList";
import TransactionsTable from "../components/TransactionsTable";
import { Wallet } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import LogoutButton from "../components/logoutButton";
import LoginButton from "../components/loginButton";
import { PrivateKeyGenerator, PublicKeyGenerator } from "../components/makeWallets";
import PrivateKeyGeneratorTsx from "../components/keysManagement";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("0x1234...5678")
  
  const [privateKey, setPrivateKey] = useState<string>("");

  useEffect(() => {
    const fetchTwitterUsername = async () => {
      if (user?.sub?.startsWith("twitter|")) {
        const twitterId = user.sub.split("|")[1];

        try {
          const response = await fetch(
            `http://localhost:5000/api/twitter-username?twitterId=${twitterId}`
          );
          const data = await response.json();
          setTwitterUsername(data.username);
        } catch (error) {
          console.error("Error fetching Twitter username:", error);
          setTwitterUsername("abcd");
        }
      }
    };

    fetchTwitterUsername();
    const key = PrivateKeyGenerator();
    console.log("Generated Private Key:", key);
    setPrivateKey(key);
  
  }, [user]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-800">Zero-X</div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  {/* Profile Section */}
                  <div className="relative group flex items-center space-x-2">
                    {/* User Image */}
                    <img
                      src={user?.picture}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    {/* Username */}
                    <span className="text-gray-800 font-medium cursor-pointer">
                      {user?.name}
                    </span>
                    {/* Twitter Username Tooltip */}
                    {twitterUsername && (
                      <div className="absolute left-0 top-10 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        @{twitterUsername}
                      </div>
                    )}
                  </div>

                  {/* Wallet Icon */}
                  <span className="text-sm text-gray-600 flex items-center">
                    <div className="px-2">
                      {walletAddress}
                    </div>
                    <Wallet className="w-4 h-4 mr-1" />
                  </span>

                  {/* Logout Button */}
                  <Button>
                    <LogoutButton />
                  </Button>
                </>
              ) : (
                <Button>
                  <LoginButton />
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isAuthenticated ? (
            <>
              <div className="md:col-span-1 space-y-6">
                <WalletInfo />
                <AirdropsList />
              </div>
              <div className="md:col-span-2">
                <TransactionsTable />
              </div>
              {/* <PrivateKeyGenerator/> */}
              <PublicKeyGenerator/>

              <PrivateKeyGeneratorTsx pvtKey={privateKey}/>
            </>
          ) : (
            <div>Please login First</div>
          )}
        </div>
      </main>
    </div>
  );
}
