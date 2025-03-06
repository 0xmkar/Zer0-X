import WalletInfo from "../components/WalletInfo";
import AirdropsList from "../components/AirdropsList";
import TransactionsTable from "../components/TransactionsTable";
import { Wallet } from "lucide-react";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import LogoutButton from "../components/logoutButton";
import LoginButton from "../components/loginButton";
import SonicWallet from "../lib/wallet";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [twitterUsername, setTwitterUsername] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState("0x1234...5678");
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");

  const fetchTwitterUsername = async () => {
    if (user?.sub?.startsWith("twitter|")) {
      const twitterId = user.sub.split("|")[1];

      try {
        const response = await fetch(
          `http://localhost:5000/api/twitter-username?twitterId=${twitterId}`
        );
        const data = await response.json();
        setTwitterUsername(data.username || "stev3raj_");
        console.log(data);
      } catch (error) {
        console.error("Error fetching Twitter username:", error);
      }
    }
  };

  const storeUserData = async () => {
    if (!twitterUsername || !user?.sub) return;
  
    const twitterId = user.sub.split("|")[1];
  
    try {
      // Check if user exists
      const checkResponse = await fetch(
        `http://localhost:5000/api/check-user?twitterId=${twitterId}`
      );
      const checkData = await checkResponse.json();
  
      if (checkData.exists) {
        console.log("User already exists in the database.");
  
        // Fetch the user's wallet data
        const userResponse = await fetch(
          `http://localhost:5000/api/get-user?twitterId=${twitterId}`
        );
        const userData = await userResponse.json();
  
        if (userData.publicKey && userData.privateKey) {
          setPublicKey(userData.publicKey);
          setWalletAddress(userData.publicKey);
          setPrivateKey(userData.privateKey);
          const pub = userData.publicKey;
          const pvt = userData.privateKey;
          console.log(JSON.stringify({ pub, pvt }) , "asdasddsadasdsaddassdaasd");
          
          localStorage.setItem("pub" , pub)
          localStorage.setItem("pvt" , pvt)
          window.postMessage({
            type: "FROM_PAGE",
            pub: pub,
            pvt: pvt,
          }, "*");
          console.log("Wallet data retrieved and stored.");
        }
        return;
      }
  
      // If user doesn't exist, create a new wallet
      const newWallet = new SonicWallet("https://rpc.blaze.soniclabs.com");
      const wallet = await newWallet.createWallet();
  
      const publicKey = wallet.address;
      const privateKey = wallet.privateKey;
      setPublicKey(publicKey);
      setWalletAddress(publicKey);
      setPrivateKey(privateKey);
  
      localStorage.setItem("pub" , publicKey)
      localStorage.setItem("pvt" , privateKey)
      window.postMessage({
        type: "FROM_PAGE",
        pub: publicKey,
        pvt: privateKey,
      }, "*");
      const newUser = {
        username: twitterUsername,
        twitterId,
        publicKey,
        privateKey,
      };
  
      // Save the new user to the database
      const saveResponse = await fetch("http://localhost:5000/api/save-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });
  
      const data = await saveResponse.json();
      console.log("User stored:", data);
    } catch (error) {
      console.error("Error storing user:", error);
    }
  };
  

  useEffect(() => {
    fetchTwitterUsername();
    storeUserData();
  }, [user, twitterUsername]);

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold text-gray-800">Zero-X</div>
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <div className="relative group flex items-center space-x-2">
                    <img
                      src={user?.picture}
                      alt={user?.name}
                      className="w-10 h-10 rounded-full border border-gray-300"
                    />
                    <span className="text-gray-800 font-medium cursor-pointer">
                      {user?.name}
                    </span>
                    {twitterUsername && (
                      <div className="absolute left-0 top-10 bg-gray-800 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                        @{twitterUsername}
                      </div>
                    )}
                  </div>
                  <span className="text-sm text-gray-600 flex items-center">
                    <div className="px-2">{walletAddress}</div>
                    <Wallet className="w-4 h-4 mr-1" />
                  </span>
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
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {isAuthenticated ? (
            <>
              <div className="md:col-span-3 space-y-6">
                <WalletInfo />
                <AirdropsList />
              </div>
              <div className="md:col-span-2">
                <TransactionsTable />
              </div>
            </>
          ) : (
            <div>Please login First</div>
          )}
        </div>
      </main>
    </div>
  );
}
