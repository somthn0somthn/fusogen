import {
    Keypair,
    Connection,
    LAMPORTS_PER_SOL,
    PublicKey,
  } from '@solana/web3.js';
  import dotenv from 'dotenv';
  import * as bip39 from 'bip39';
  import { derivePath } from 'ed25519-hd-key';
  import {
    TOKEN_PROGRAM_ID,
    createMint,
    createAccount,
    mintTo,
  } from '@solana/spl-token';
  
  dotenv.config({ path: '../.env' });
  
  (async () => {
    // Step 1: Load the secret phrase from the environment variable
    const secretPhrase = process.env.SECRET_PHRASE_ONE;
    if (!secretPhrase) {
      throw new Error("Secret phrase not found. Make sure it's stored in the .env file");
    }
  
    // Step 2: Convert the mnemonic (secret phrase) to a seed
    const seed = await bip39.mnemonicToSeed(secretPhrase);
  
    // Step 3: Derive the keypair from the seed using Solana's derivation path
    const derivationPath = "m/44'/501'/0'/0'"; // Solana's derivation path for wallets
    const derivedSeed = derivePath(derivationPath, seed.toString('hex')).key;
    const keypair = Keypair.fromSeed(derivedSeed.slice(0, 32));
  
    // Step 4: Set up Solana connection
    //localnet
    //const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
    //devnet
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    console.log("Wallet public key:", keypair.publicKey.toBase58());
  
    // Airdrop some SOL to the wallet for testing purposes
    //const airdropSignature = await connection.requestAirdrop(keypair.publicKey, 10 * LAMPORTS_PER_SOL);
    //await connection.confirmTransaction(airdropSignature);
  
    // Step 5: Create DAO A and DAO B mints and their associated token accounts
    const mintA = await createMint(connection, keypair, keypair.publicKey, null, 9);
  
    // Step 6: Create Associated Token Accounts (ATAs) for DAO A and DAO B
    const tokenAccountA = await createAccount(connection, keypair, mintA, keypair.publicKey);
  
    // Step 7: Mint tokens to DAO A and DAO B token accounts
    await mintTo(connection, keypair, mintA, tokenAccountA, keypair.publicKey, 1000);
  
    console.log("Mint A public key:", mintA.toBase58());
    console.log("Token Account A public key:", tokenAccountA.toBase58());

  
    // Optional: Confirm balances
    const tokenAccountABalance = await connection.getTokenAccountBalance(tokenAccountA);
    console.log("Token Account A balance:", tokenAccountABalance.value.amount);
  })();
  