// utils/cryptoUtils.ts
export async function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveKey"]
    );
  
    return window.crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: 100000,
        hash: "SHA-256",
      },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  }
  
  export async function encryptPrivateKey(password: string, privateKey: string): Promise<{ encrypted: ArrayBuffer; salt: Uint8Array; iv: Uint8Array }> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
    const key = await deriveKey(password, salt);
    const encodedPrivateKey = new TextEncoder().encode(privateKey);
    
    const encrypted = await window.crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      encodedPrivateKey
    );
  
    return { encrypted, salt, iv };
  }
  
  export async function decryptPrivateKey(password: string, encryptedData: ArrayBuffer, salt: Uint8Array, iv: Uint8Array): Promise<string | null> {
    try {
      const key = await deriveKey(password, salt);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        encryptedData
      );
  
      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error("Decryption failed:", error);
      return null;
    }
  }
  