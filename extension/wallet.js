import { SonicWallet } from "./sonicWallet  ";  // Import SonicWallet from another file

const sonicWallet = new SonicWallet('https://rpc.blaze.soniclabs.com');

// In wallet.js
export async function importWalletAndSendTokens(privateKey, recipientAddress, amount) {
    try {
      const walletInfo = await sonicWallet.createWallet(privateKey);
      const balance = await sonicWallet.getBalance(walletInfo.address);
  
      if (parseFloat(balance) <= 0) {
        throw new Error("Insufficient balance to send tokens"); // Explicit error
      }
  
      await sendTokens(recipientAddress, amount);
    } catch (error) {
      console.error("Error:", error.message);
      throw error; // Re-throw to ensure the promise rejects
    }
  }


// Add error wrapper to sendTokens
export async function sendTokens(recipientAddress, amount) {
  try {
    // Your existing sendTokens implementation
  } catch (error) {
    throw new Error(`Send failed: ${error.message}`);
  }
}
