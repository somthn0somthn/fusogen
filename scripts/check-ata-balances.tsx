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
  const oldTreasuryATokenAccountStr = 'Hsb2K7egunEagfdZB7Lg5qFVpmdXMiA6f8ZVyH8u7uHV';
  const oldTreasuryBTokenAccountStr = 'NsSAt854J3BbaCdU5usRAozKaxyoqwMVzv8ho6xAZxz';
  const newTreasuryATokenAccountStr = 'FG31ihgdERS7qmeMfAEMWwV6DxSwp8hE7V7ieT5k2JNc';
  const newTreasuryBTokenAccountStr = 'CmYzgbn92FjEDb9d5LdZd9THN25SXcnHJzApDsfoMFpx';

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
