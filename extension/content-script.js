// content-script.js
window.addEventListener("message", (event) => {
    if (event.data.type === "FROM_PAGE") {
      // Forward the message to the background script
      chrome.runtime.sendMessage({
        type: "SET_KEYS",
        pub: event.data.pub,
        pvt: event.data.pvt,
      });
    }
  });