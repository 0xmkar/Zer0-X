document.addEventListener("DOMContentLoaded", () => {
  const textDisplay = document.getElementById("textDisplay");

  chrome.storage.local.get(["selectedText"], async (data) => {
    if (!data.selectedText) {
      textDisplay.innerText = "No text selected.";
      return;
    }

    // Show processing message
    textDisplay.innerText = `Processing...\n\n"${data.selectedText}"`;

    // Send request to Flask backend
    try {
      const response = await fetch("http://127.0.0.1:5000/analyze", {
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
  const textDisplay2Container = textDisplay2.parentElement; // Get the parent div

  chrome.storage.local.get(["pub", "pvt"], (data) => {
    if (data.pub && data.pvt) {
      console.log("Public Key:", data.pub);
      console.log("Private Key:", data.pvt);
      textDisplay2.innerText = `Public Key: ${data.pub}\nPrivate Key: ${data.pvt}`;
      visitButton.style.display = "none";
    } else {
      textDisplay2Container.style.display = "none";
    }
  });
});
