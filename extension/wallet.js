import { SonicWallet } from "./sonicWallet  ";  // Import SonicWallet from another file

const sonicWallet = new SonicWallet('https://rpc.blaze.soniclabs.com');

export async function importWalletAndSendTokens(privateKey, recipientAddress, amount) {
  try {
    const walletInfo = await sonicWallet.createWallet(privateKey);
    console.log("Wallet imported successfully!");
    
    const balance = await sonicWallet.getBalance(walletInfo.address);

    if (parseFloat(balance) > 0) {
      await sendTokens(recipientAddress, amount);
    } else {
      console.log("Insufficient balance to send tokens");
    }
  } catch (error) {
    console.error("Error importing wallet:", error.message);
  }
}

export async function sendTokens(recipientAddress, amount) {
  try {
    if (!sonicWallet.isValidSonicAddress(recipientAddress)) {
      throw new Error("Invalid recipient address format");
    }
    
    const options = {
      gasPrice: "10000000000",
      gasLimit: "21000"
    };

    const receipt = await sonicWallet.sendTransaction(recipientAddress, amount, options);
    console.log("Transaction Successful:", receipt.transactionHash);
  } catch (error) {
    console.error("Error sending tokens:", error.message);
  }
}
