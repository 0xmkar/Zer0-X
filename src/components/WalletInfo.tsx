import { Wallet } from "lucide-react";
import { JSX, useEffect, useState } from "react";

interface WalletData {
  balance: string;
  usdValue: string;
}

interface BalanceResponse {
  status: 'success' | 'Failure';
  details: {
    address?: string;
    balance?: any;
  };
}

// Helper function to safely access Chrome storage or use a fallback
const getFromStorage = async (key: string): Promise<string | null> => {
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        resolve(result[key] || null);
      });
    });
  } else {
    console.log("Chrome extension API not available, using fallback storage");
    const mockValue = localStorage.getItem(key);
    return mockValue || "no_private_key";
  }
};

const formatBalance = (balance: any): string => {
  if (balance === undefined || balance === null) {
    return "N/A";
  }
  
  if (typeof balance === 'object') {
    if (balance.toString && balance.toString() !== '[object Object]') {
      return balance.toString();
    }
    
    if (balance.value !== undefined) return balance.value.toString();
    if (balance.amount !== undefined) return balance.amount.toString();
    
    try {
      return JSON.stringify(balance);
    } catch (e) {
      return "Invalid balance format";
    }
  }
  
  return balance.toString();
};

export default function WalletInfo(): JSX.Element {
  const [walletData, setWalletData] = useState<WalletData>({
    balance: "Loading...",
    usdValue: "Loading..."
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletBalance = async (): Promise<void> => {
      try {
        const privateKey = "0xe897c166f990af5372d15cf6ff76cfafd7ee2264adb5edb2d569f221bf78e093";

        if (!privateKey) {
          setError("No private key found");
          setWalletData({
            balance: "N/A",
            usdValue: "$ 0.0"
          });
          return;
        }

        // Call the getBalance endpoint
        const response = await fetch("http://localhost:5000/getBalance", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            privateKey: privateKey
          })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result: BalanceResponse = await response.json();
        console.log("API Response:", result); // Add this to debug the response
        
        if (result.status === "success" && result.details.balance !== undefined) {
          const formattedBalance = formatBalance(result.details.balance);
          setWalletData({
            balance: formattedBalance + " S",
            usdValue: "$ 0.0" // You can calculate this if you have exchange rate data
          });
        } else {
          setError("Failed to get balance");
          setWalletData({
            balance: "Error",
            usdValue: "$ 0.0"
          });
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setError("Failed to load wallet data");
        setWalletData({
          balance: "Error",
          usdValue: "$ 0.0"
        });
      }
    };

    fetchWalletBalance();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="space-y-2 flex gap-[100px] b">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Wallet className="w-5 h-5 mr-2 flex" />
          Wallet Info
          {error && <span className="text-xs text-red-500 ml-2">({error})</span>}
        </h2>
        <div>
          <p className="text-sm text-gray-600">Balance:</p>
          <hr />
          <p className="text-lg font-semibold">{walletData.balance}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">USD Value:</p>
          <hr />
          <p className="text-lg font-semibold">0.0 $</p>
        </div>
        <a href="/airdrops" className="bg-blue-300 flex items-center justify-center p-4 rounded text-lg font-semibold">
          Create Airdrop
        </a>
      </div>
    </div>
  );
}