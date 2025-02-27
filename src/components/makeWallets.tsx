export function PublicKeyGenerator(): string {
  let number = "";
  for (let i = 0; i < 32; i++) {
    number += Math.floor(Math.random() * 10); // Generates a digit from 0-9
  }
  return number;
}
export function PrivateKeyGenerator(): string {
  let number = "";
  for (let i = 0; i < 32; i++) {
    number += Math.floor(Math.random() * 10); // Generates a digit from 0-9
  }
  return number;
}
