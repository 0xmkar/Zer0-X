let resultdata = null;

document.addEventListener("DOMContentLoaded", () => {
  const textDisplay = document.getElementById("textDisplay");
  const textDisplay3 = document.getElementById("textDisplay3");
  const textDisplay4 = document.getElementById("textDisplay4");
  const sendButton = document.getElementById("sendButton");

  chrome.storage.local.get(["selectedText", "pub", "pvt"], async (data) => {
    if (!data.selectedText) {
      textDisplay.innerText = "No text selected.";
      return;
    }

    textDisplay.innerText = `Processing...\n\n"${data.selectedText}"`;

    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.selectedText }),
      });

      const result = await response.json();
      resultdata = result;

      textDisplay.innerText = result.result || "Error getting AI response.";
      textDisplay3.innerText = data.pvt || "Error getting private key.";

      // Enable send button if data is available
      if (data.pub && data.pvt && resultdata) {
        sendButton.disabled = false;
        sendButton.classList.remove("opacity-50");
        textDisplay4.innerText = "Ready to send tokens.";
      } else {
        textDisplay4.innerText = "Error: Missing data or keys.";
      }

    } catch (error) {
      console.error("Request error:", error);
      textDisplay.innerText = "Server error. Make sure Flask is running.";
    }
  });

  // Handle send button click
  sendButton.addEventListener("click", async () => {
    const currentData = await chrome.storage.local.get(["pub", "pvt"]);
    
    if (!currentData.pub || !currentData.pvt || !resultdata) {
      textDisplay4.innerText = "Error: Missing keys or data.";
      return;
    }

    const amt = resultdata.result[2];
    const receiverPublicKey = resultdata.receiverPublicKey;

    chrome.runtime.sendMessage(
      {
        action: "sendTokens",
        privateKey: currentData.pvt,
        recipientAddress: receiverPublicKey,
        amount: amt,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          textDisplay4.innerText = "Error: " + chrome.runtime.lastError.message;
          return;
        }
        if (response?.status === "success") {
          textDisplay4.innerText = `Sent ${amt} to ${receiverPublicKey}`;
        } else {
          textDisplay4.innerText = `Error: ${response?.message || "Unknown error"}`;
        }
      }
    );
  });
});