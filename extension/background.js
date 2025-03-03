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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "sendTokens") {
    importWalletAndSendTokens(message.privateKey, message.recipientAddress, message.amount)
      .then(() => sendResponse({ status: "success" }))
      .catch((err) => sendResponse({ status: "error", message: err.message }));
    return true; // Keep the message channel open for async response
  }
});
