// utils/indexedDB.ts
export function openDB() {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open("WalletDB", 1);
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys", { keyPath: "id" });
        }
      };
  
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Failed to open IndexedDB");
    });
  }
  
  export async function storeEncryptedKey(encrypted: ArrayBuffer, salt: Uint8Array, iv: Uint8Array) {
    const db = await openDB();
    const tx = db.transaction("keys", "readwrite");
    const store = tx.objectStore("keys");
    
    store.put({ id: "walletKey", encrypted, salt, iv });
    // await tx.complete;
    await tx.oncomplete;
  }
  
//   export async function getEncryptedKey() {
//     const db = await openDB();
//     return new Promise((resolve, reject) => {
//       const tx = db.transaction("keys", "readonly");
//       const store = tx.objectStore("keys");
//       const request = store.get("walletKey");
  
//       request.onsuccess = () => resolve(request.result);
//       request.onerror = () => reject("Failed to retrieve key");
//     });
//   }
export async function getEncryptedKey(): Promise<{ encrypted: ArrayBuffer; salt: Uint8Array; iv: Uint8Array } | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("keys", "readonly");
      const store = tx.objectStore("keys");
      const request = store.get("walletKey");
  
      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result as { encrypted: ArrayBuffer; salt: Uint8Array; iv: Uint8Array });
        } else {
          resolve(null);
        }
      };
  
      request.onerror = () => reject("Failed to retrieve key");
    });
  }
  