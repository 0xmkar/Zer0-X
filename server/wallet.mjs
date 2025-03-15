import BaseWallet from "./BaseWallet.mjs";

const baseWallet = new BaseWallet('https://base-sepolia.drpc.org');

export async function importWalletAndSendTokens(privateKey, recipientAddress, amount) {
  try {
    const walletInfo = await baseWallet.createWallet(privateKey);
    const balance = await baseWallet.getBalance(walletInfo.address);

    if (parseFloat(balance) <= amount) {
      throw new Error("Insufficient balance to send tokens");
    }

    const tnxHash = await sendTokens(recipientAddress, amount);
    return { status: 'success', details: { privateKey, recipientAddress, amount, tnxHash } };
  } catch (error) {
    console.error("Error:", error.message);
    return { status: 'Failure', details: { privateKey, recipientAddress, amount, Error:error.message } };
  }
}


// Add error wrapper to sendTokens
export async function sendTokens(recipientAddress, amount) {
try {
  // Validate the recipient address
  if (!baseWallet.isValidBaseAddress(recipientAddress)) {
    throw new Error("Invalid recipient address format");
  }
  
  console.log(`Sending ${amount} S to ${recipientAddress}...`);
  
  const options = {
    gasPrice: "10000000000", // 10 Gwei
    gasLimit: "21000"        // Standard transfer gas limit
  };
  
  // Send the transaction
  const receipt = await baseWallet.sendTransaction(recipientAddress, amount, options);
  
  console.log("📄 Transaction sent successfully! 📄 ");
  console.log(`Transaction hash: ${receipt.transactionHash}`);
  console.log(`Block number: ${receipt.blockNumber}`);
  console.log(`Gas used: ${receipt.gasUsed}`);
  console.log("📄 Transaction sent successfully! 📄 ");

  return receipt.transactionHash
} catch (error) {
  console.error("Error sending tokens:", error.message);
}
}


// importWalletAndSendTokens("0xd44862d86a0ea8058ad198de689e271947d270c1cc42488502e795b9f2ffabc6", "0x6D5fE131dD6601753F3A7F31EA9A793A1e1c6679", "0.05");

export async function getBalanceWallet(privateKey) {
  try {
    const walletInfo = await baseWallet.createWallet(privateKey);
    const balance = await baseWallet.getBalance(walletInfo.address);

    return { status: 'success', details: { address:walletInfo.publicKey, balance } };
  } catch (error) {
    console.error("Error:", error.message);
    return { status: 'Failure', details: { address:walletInfo.publicKey } };
    // throw error; // Re-throw to ensure the promise rejects
  }
}