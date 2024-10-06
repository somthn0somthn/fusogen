import { Connection, PublicKey } from '@solana/web3.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

(async () => {
  // Step 1: Set up Solana connection
  //localnet
  //const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
  //devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');


  // Step 2: Provide the relevant token account public keys here
  const oldTreasuryATokenAccountStr = 'qBrEX4TDn1J4cX3VRwj7jdYocemc7Akx1T7t772bHL3';
  const oldTreasuryBTokenAccountStr = 'GXjsuXsiifPabgEVT7ye4rreSaQz1ijSpL51ocNMax3r';
  const newTreasuryATokenAccountStr = 'B5wV1qskeYtwMsbBsEdAXS6ZVi2wysW2qqXQNafBf8c';
  const newTreasuryBTokenAccountStr = 'BfbiHin6R3EhzNxJ64q5TZtyCBg6tgSZEA7ATe42fXJq';

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
