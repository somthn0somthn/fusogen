import * as anchor from '@coral-xyz/anchor';
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  clusterApiUrl,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  MINT_SIZE,
  createMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
  getAssociatedTokenAddress,
} from '@solana/spl-token';
import { AnchorProvider } from '@coral-xyz/anchor';

async function generateMintAndATA() {
  // Initialize connection to the local validator
  const connection = new Connection("http://127.0.0.1:8899", 'confirmed');

  // Generate a new wallet keypair for the user (you can replace this with an existing one)
  const user = Keypair.generate();
  
  // Airdrop some SOL to the user (required to pay for transactions and rent)
  const airdropSignature = await connection.requestAirdrop(user.publicKey, 2 * anchor.web3.LAMPORTS_PER_SOL);
  await connection.confirmTransaction(airdropSignature);

  // Create the mint account
  const mintAuthority = Keypair.generate();  // Mint authority can be the same as user or a new keypair
  const freezeAuthority = null;              // We can set this to null if we don't want freeze authority

  // Create the mint with 9 decimal places (standard for tokens like SOL)
  const mint = await createMint(
    connection,                // Connection to Solana network
    user,                      // The account paying for the creation of the mint
    mintAuthority.publicKey,    // Mint authority (who can mint new tokens)
    freezeAuthority,            // Freeze authority (optional, can be null)
    9,                          // Number of decimals
  );

  console.log(`Mint Address: ${mint.toBase58()}`);

  // Create ATA for the user (Associated Token Account)
  const userATA = await getOrCreateAssociatedTokenAccount(
    connection,                  // Connection
    user,                        // Payer (who pays for the creation of the ATA)
    mint,                        // The mint for which the ATA is being created
    user.publicKey               // Owner of the ATA (the user's wallet)
  );

  console.log(`User ATA Address: ${userATA.address.toBase58()}`);

  // Mint some tokens to the user's ATA
  const amount = 1000;  // Mint 1000 tokens (9 decimal places)
  await mintTo(
    connection,                      // Connection
    user,                            // Payer
    mint,                            // Mint account
    userATA.address,                 // Destination ATA (where tokens go)
    mintAuthority,                   // Mint authority (who has the right to mint)
    amount                           // Amount to mint (1000 tokens)
  );

  console.log(`Minted ${amount / Math.pow(10, 9)} tokens to ATA: ${userATA.address.toBase58()}`);
}

generateMintAndATA().then(() => {
  console.log("Mint and ATA creation complete");
}).catch((error) => {
  console.error("Error generating mint and ATA:", error);
});
