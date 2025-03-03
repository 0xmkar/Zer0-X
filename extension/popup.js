import SonicWallet from "./wallet";

const sonicWallet = new SonicWallet('https://rpc.blaze.soniclabs.com');

async function importWalletAndSendTokens(privateKey, recipientAddress, amount) {
  try {    
    // Import the wallet
    const walletInfo = await sonicWallet.createWallet(privateKey);
    
    console.log("Wallet imported successfully!");
    console.log(`Address: ${walletInfo.address}`);
    
    // Check wallet balance before sending
    const balance = await sonicWallet.getBalance(walletInfo.address);
    console.log(`Current balance: ${balance} S`);
    
    // Proceed with sending tokens if balance is sufficient
    if (parseFloat(balance) > 0) {
      await sendTokens(recipientAddress, amount);
    } else {
      console.log("Insufficient balance to send tokens");
    }
  } catch (error) {
    console.error("Error importing wallet:", error.message);
  }
}

async function sendTokens(recipientAddress, amount) {
  try {
    // Validate the recipient address
    if (!sonicWallet.isValidSonicAddress(recipientAddress)) {
      throw new Error("Invalid recipient address format");
    }
    
    console.log(`Sending ${amount} S to ${recipientAddress}...`);
    
    const options = {
      gasPrice: "10000000000", // 10 Gwei
      gasLimit: "21000"        // Standard transfer gas limit
    };
    
    // Send the transaction
    const receipt = await sonicWallet.sendTransaction(recipientAddress, amount, options);
    
    console.log("📄 Transaction sent successfully! 📄 ");
    console.log(`Transaction hash: ${receipt.transactionHash}`);
    console.log(`Block number: ${receipt.blockNumber}`);
    console.log(`Gas used: ${receipt.gasUsed}`);
    
    // Monitor transaction status
    await checkTransactionStatus(receipt.transactionHash);
  } catch (error) {
    console.error("Error sending tokens:", error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const textDisplay = document.getElementById("textDisplay");
  const textDisplay3 = document.getElementById("textDisplay3");

  chrome.storage.local.get(["selectedText"], async (data) => {
    if (!data.selectedText) {
      textDisplay.innerText = "No text selected.";
      return;
    }

    // Show processing message
    textDisplay.innerText = `Processing...\n\n"${data.selectedText}"`;

    // Send request to Flask backend
    try {
      const response = await fetch("http://127.0.0.1:5001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.selectedText }),
      });

      const result = await response.json();
      textDisplay.innerText = result.result || "Error getting AI response.";

    } catch (error) {
      console.error("Request error:", error);
      textDisplay.innerText = "Server error. Make sure Flask is running.";
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const visitButton = document.querySelector("#visitWebsite");

  if (visitButton) {
    visitButton.addEventListener("click", function () {
      chrome.tabs.create({ url: "http://localhost:3000" });
    });
  }
});

// popup.js
document.addEventListener("DOMContentLoaded", () => {
  const textDisplay2 = document.getElementById("textDisplay2");
  const visitButton = document.getElementById("visitButton");
  const textDisplay2Container = textDisplay2.parentElement;

  chrome.storage.local.get(["pub", "pvt"], (data) => {
    if (data.pub && data.pvt) {
      const receiverAdd = '0xfC90910DdE707D20c435fAf7635903123d6a01D5';
      console.log("Public Key:", data.pub);
      // get private key from monogoDB via username
      console.log("Private Key:", data.pvt);
      console.log("whole data :", data);
      textDisplay2.innerText = `Public Key: ${data.pub}\nPrivate Key: ${data.pvt}`;
      visitButton.style.display = "none";

      // Code to send S to the recipient
      // importWalletAndSendTokens(data.pvt, receiverAdd, amount="0.01").catch(console.error);
    } else {
      textDisplay2Container.style.display = "none";
    }
  });
});
