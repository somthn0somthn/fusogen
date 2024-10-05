import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

(async () => {
  // Step 1: Set up Solana connection
  const connection = new Connection('http://127.0.0.1:8899', 'confirmed');

  // Step 2: Provide the relevant token account public keys here
  const oldTreasuryATokenAccountStr = 'CwZntaM6SToAPr1Xa9khhgZDNuAsAKy21w9nUjzvWXfX';
  const oldTreasuryBTokenAccountStr = 'JUH7a7JE4NZUZrzKqsGFPDKbvo5LHNgGqwFoukE1r3o';
  const newTreasuryATokenAccountStr = 'HhXsHfRjFTZrbgH7x82iighQdnkXYuRjRM1GYRbW51LA';
  const newTreasuryBTokenAccountStr = 'B7M5FguHV8G3qdSp9MmFYqXa1iyhdkzatDUwatVQS92D';

  // Convert string to PublicKey
  const oldTreasuryATokenAccount = new PublicKey(oldTreasuryATokenAccountStr);
  const oldTreasuryBTokenAccount = new PublicKey(oldTreasuryBTokenAccountStr);
  const newTreasuryATokenAccount = new PublicKey(newTreasuryATokenAccountStr);
  const newTreasuryBTokenAccount = new PublicKey(newTreasuryBTokenAccountStr);

  // Step 3: Fetch balances
  try {
    // Fetch old treasury token account balances
    const oldTreasuryABalance = await connection.getTokenAccountBalance(oldTreasuryATokenAccount);
    const oldTreasuryBBalance = await connection.getTokenAccountBalance(oldTreasuryBTokenAccount);

    console.log("Old Treasury A Token Account balance:", oldTreasuryABalance.value.amount);
    console.log("Old Treasury B Token Account balance:", oldTreasuryBBalance.value.amount);

    // Fetch new treasury token account balances
    const newTreasuryABalance = await connection.getTokenAccountBalance(newTreasuryATokenAccount);
    const newTreasuryBBalance = await connection.getTokenAccountBalance(newTreasuryBTokenAccount);

    console.log("New Treasury A Token Account balance:", newTreasuryABalance.value.amount);
    console.log("New Treasury B Token Account balance:", newTreasuryBBalance.value.amount);

  } catch (err) {
    console.error('Error fetching token account balances:', err);
  }
})();
