let resultdata = null;

document.addEventListener("DOMContentLoaded", () => {
  const textDisplay = document.getElementById("textDisplay");
  const textDisplay4 = document.getElementById("textDisplay4");
  // const ready_container = document.getElementById("ready_container");
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

      const command = result.finalresponse[0].charAt(0).toUpperCase() + result.finalresponse[0].slice(1);
      const token = result.finalresponse[1];
      const amount = result.finalresponse[2]; 
      const recipient = result.finalresponse[3];

      textDisplay.innerText = `${command}ing ${amount} ${token.toUpperCase()} to ${recipient}` || "Error getting AI response.";

      // Enable send button if data is available
      if (data.pub && data.pvt && resultdata) {
        sendButton.disabled = false;
        sendButton.classList.remove("opacity-50");
        textDisplay4.innerText = "Ready to send tokens.";
        // ready_container.style = "background:#00B7F8";
      } else {
        textDisplay4.innerText = "Error: Missing data or keys.";
      }

    } catch (error) {
      console.error("Request error:", error);
      textDisplay.innerText = "Server error. Make sure Flask is running.";
    }
  });

  // In sendButton click handler
  sendButton.addEventListener("click", async () => {
    try {
      textDisplay4.innerText = "Sending...";
      sendButton.disabled = true;
  
      // Force popup to stay open
      await new Promise(resolve => setTimeout(resolve, 3000));
  
      let responseData;

      try {
        const response = await fetch('http://localhost:5000/import-wallet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            privateKey: (await chrome.storage.local.get("pvt")).pvt,
            recipientAddress: resultdata.receiverPublicKey,
            amount: resultdata.finalresponse[2]
          })
        });
        console.log(response)
  
        if (!response.ok) {
          // console.log(response)
          return;
        }

        responseData = await response.json();
        // textDisplay4.innerText = `Response2 from /import-wallet: ${JSON.stringify(responseData)}`;
      } catch (error) {
        responseData = { message: error.message };
      }
  
      textDisplay4.innerText = responseData?.status === "success" 
        ? `Sent ${resultdata.finalresponse[2]} tokens\n Tnx Hash - ${responseData.details.tnxHash}`
        : `lavda Error: ${JSON.stringify(responseData) || "Check console"}`;
    
    } catch (error) {
      textDisplay4.innerText = `sexy Error: ${error.message}`;
    } finally {
      sendButton.disabled = false;
    }
  }); 
});
// Cannot read properties of undefined (reading '2')