import { useEffect, useState } from "react";

export function PublicKeyGenerator() {
  const [randomNumber, setRandomNumber] = useState<string>("");

  useEffect(() => {
    const generateRandomNumber = () => {
      let number = "";
      for (let i = 0; i < 32; i++) {
        number += Math.floor(Math.random() * 10); // Generates a digit from 0-9
      }
      return number;
    };

    setRandomNumber(generateRandomNumber());
  }, []);

  return (
    <div className="p-4 bg-gray-200 rounded-lg text-center font-mono">
      <p className="text-lg font-bold">{randomNumber}</p>
    </div>
  );
}
export function PrivateKeyGenerator() {
  const [randomNumber, setRandomNumber] = useState<string>("");

  useEffect(() => {
    const generateRandomNumber = () => {
      let number = "";
      for (let i = 0; i < 32; i++) {
        number += Math.floor(Math.random() * 10); // Generates a digit from 0-9
      }
      return number;
    };

    setRandomNumber(generateRandomNumber());
  }, []);

  return (
    <div className="p-4 bg-gray-200 rounded-lg text-center font-mono">
      <p className="text-lg font-bold">{randomNumber}</p>
    </div>
  );
}

export default function RandomKeysGenerator(){
    return (
        <div>
            <div>
            publickey : <PublicKeyGenerator/>
            </div>
            <div>
            privatekey : <PrivateKeyGenerator/>
            </div>
        </div>
    )
}