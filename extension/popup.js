let resultdata = null;

document.addEventListener("DOMContentLoaded", () => {
  const textDisplay = document.getElementById("textDisplay");
  const textDisplay2 = document.getElementById("textDisplay2");
  const textDisplay3 = document.getElementById("textDisplay3");
  const textDisplay4 = document.getElementById("textDisplay4");
  const textDisplay5 = document.getElementById("textDisplay5");
  const sendButton = document.getElementById("sendButton");

  chrome.storage.local.get(["selectedText", "pub", "pvt"], async (data) => {
    if (!data.selectedText) {
      textDisplay.innerText = "No text selected.";
      return;
    }

    textDisplay.innerText = `Processing...\n\n"${data.selectedText}"`;

    try {
      const response = await fetch("http://127.0.0.1:5001/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.selectedText }),
      });

      const result = await response.json();
      resultdata = result;

      textDisplay.innerText = result.finalresponse || "Error getting AI response.";
      textDisplay2.innerText = data.pub || "Error getting pub key.";
      textDisplay3.innerText = data.pvt || "Error getting private key.";
      textDisplay5.innerText = result.receiverPublicKey || "Error getting pub key.";

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
  // Inside the sendButton click handler:
// In sendButton click handler
sendButton.addEventListener("click", async () => {
  try {
    textDisplay4.innerText = "Sending...";
    sendButton.disabled = true;

    // Force popup to stay open
    await new Promise(resolve => setTimeout(resolve, 3000));

    const response = await chrome.runtime.sendMessage({
      action: "sendTokens",
      privateKey: (await chrome.storage.local.get("pvt")).pvt,
      recipientAddress: resultdata.receiverPublicKey,
      amount: resultdata.result[2]
    });

    textDisplay4.innerText = response?.status === "success" 
      ? `Sent ${resultdata.result[2]} tokens` 
      : `Error: ${response?.message || "Check aaaaaa error"}`;

  } catch (error) {
    textDisplay4.innerText = `Error: ${error.message}`;
  } finally {
    sendButton.disabled = false;
  }
});
});
