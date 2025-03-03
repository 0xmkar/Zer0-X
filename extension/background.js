chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openWithExtension",
    title: "use 0x",
    contexts: ["selection"]
  });
  chrome.storage.local.get("username", (data) => {
    if (!data.username) {
      chrome.storage.local.set({ username: "GuestUser" });
    }
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "openWithExtension") {
    chrome.storage.local.set({ selectedText: info.selectionText }, () => {
      chrome.action.openPopup();
    });
  }
});

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SET_KEYS") {
    chrome.storage.local.set({
      pub: message.pub,
      pvt: message.pvt,
    });
  }
});

import { importWalletAndSendTokens } from "./wallet.js";
// In background.js
// In background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendTokens") {
    (async () => {
      try {
        await importWalletAndSendTokens(
          message.privateKey,
          message.recipientAddress,
          message.amount
        );
        sendResponse({ status: "success" });
      } catch (err) {
        sendResponse({ 
          status: "error", 
          message: err.message || "Transaction failed" 
        });
      }
    })();
    return true; // Keep port open
  }
});
