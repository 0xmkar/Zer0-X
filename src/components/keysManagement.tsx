import { useState } from "react";
import { encryptPrivateKey, decryptPrivateKey } from "../utils/cryptoUtils";
import { storeEncryptedKey, getEncryptedKey } from "../utils/indexedDB";

type Props = {
    pvtKey: string;
};

export default function PrivateKeyGeneratorTsx( {pvtKey}:Props ) {
  const [password, setPassword] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [decryptedKey, setDecryptedKey] = useState<string | null>(null);

  const setpvtkey = async () =>{
    setPrivateKey(pvtKey);
    return privateKey;
  } 
  const handleEncryptAndStore = async () => {
    if (!password) return alert("Enter a password!");
    
    const { encrypted, salt, iv } = await encryptPrivateKey(password, await setpvtkey());
    await storeEncryptedKey(encrypted, salt, iv);
    
    alert("Private key encrypted and stored!");
  };

//   const handleRetrieveAndDecrypt = async () => {
//     if (!password) return alert("Enter a password!");

//     const storedData = await getEncryptedKey();
//     if (!storedData) return alert("No stored key found!");

//     const decrypted = await decryptPrivateKey(password, storedData.encrypted, storedData.salt, storedData.iv);
//     setDecryptedKey(decrypted);
//   };
const handleRetrieveAndDecrypt = async () => {
    if (!password) return alert("Enter a password!");
  
    const storedData = await getEncryptedKey();
    if (!storedData) {
      alert("No stored key found!");
      return;
    }
  
    const { encrypted, salt, iv } = storedData; // Ensure properties exist
    const decrypted = await decryptPrivateKey(password, encrypted, salt, iv);
  
    if (decrypted) {
      setDecryptedKey(decrypted);
    } else {
      alert("Decryption failed! Incorrect password or corrupted data.");
    }
  };
  
  return (
    <div className="p-4 border rounded-md bg-white">
      <h2 className="text-lg font-bold">Wallet Encryption</h2>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 w-full my-2"
      />
      <button onClick={handleEncryptAndStore} className="bg-blue-500 text-white px-4 py-2 rounded-md mr-2">
        Encrypt & Store
      </button>
      <button onClick={handleRetrieveAndDecrypt} className="bg-green-500 text-white px-4 py-2 rounded-md">
        Retrieve & Decrypt
      </button>

      {decryptedKey && (
        <p className="mt-4 text-gray-700">Decrypted Key: {decryptedKey}</p>
      )}
    </div>
  );
}
