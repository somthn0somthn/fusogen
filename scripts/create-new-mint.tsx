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
    getOrCreateAssociatedTokenAccount,
  } from '@solana/spl-token';
  
  dotenv.config({ path: '../.env' });
  
  (async () => {
    // Step 1: Load the secret phrase from the environment variables for both wallets
    const secretPhraseWalletA = process.env.SECRET_PHRASE_ONE;
    const secretPhraseWalletB = process.env.SECRET_PHRASE_TWO;
  
    if (!secretPhraseWalletA || !secretPhraseWalletB) {
      throw new Error("Secret phrase(s) not found. Make sure they are stored in the .env file");
    }
  
    // Step 2: Convert the mnemonics (secret phrases) to seeds for both wallets
    const seedA = await bip39.mnemonicToSeed(secretPhraseWalletA);
    const seedB = await bip39.mnemonicToSeed(secretPhraseWalletB);
  
    // Step 3: Derive the keypairs from the seeds using Solana's derivation path
    const derivationPath = "m/44'/501'/0'/0'"; // Solana's derivation path for wallets
    const derivedSeedA = derivePath(derivationPath, seedA.toString('hex')).key;
    const derivedSeedB = derivePath(derivationPath, seedB.toString('hex')).key;
  
    const walletAKeypair = Keypair.fromSeed(derivedSeedA.slice(0, 32));
    const walletBKeypair = Keypair.fromSeed(derivedSeedB.slice(0, 32));
  
    // Step 4: Set up Solana connection
    const connection = new Connection('http://127.0.0.1:8899', 'confirmed');
    console.log("Wallet A public key:", walletAKeypair.publicKey.toBase58());
    console.log("Wallet B public key:", walletBKeypair.publicKey.toBase58());
  
    // Step 5: Airdrop SOL to both wallets for testing purposes
    const airdropSignatureA = await connection.requestAirdrop(walletAKeypair.publicKey, 10 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignatureA);
    
    const airdropSignatureB = await connection.requestAirdrop(walletBKeypair.publicKey, 10 * LAMPORTS_PER_SOL);
    await connection.confirmTransaction(airdropSignatureB);
  
    // Step 6: Create the new mint with Wallet A as the mint authority
    const newMint = await createMint(connection, walletAKeypair, walletAKeypair.publicKey, null, 9); // Decimals set to 9 for token precision
  
    // Step 7: Create associated token accounts (ATA) for both Wallet A and Wallet B using the new mint
    const walletATokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletAKeypair,      // Payer
      newMint,             // Mint
      walletAKeypair.publicKey // Owner (Wallet A)
    );
  
    const walletBTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      walletAKeypair,      // Payer (use Wallet A to create Wallet B's token account)
      newMint,             // Mint
      walletBKeypair.publicKey // Owner (Wallet B)
    );
  
    console.log("New Mint public key:", newMint.toBase58());
    console.log("Wallet A Token Account public key:", walletATokenAccount.address.toBase58());
    console.log("Wallet B Token Account public key:", walletBTokenAccount.address.toBase58());

  })();
  