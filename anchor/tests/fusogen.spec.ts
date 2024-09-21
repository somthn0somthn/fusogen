import * as anchor from '@coral-xyz/anchor';
import { Program } from '@coral-xyz/anchor';
import { Fusogen } from '../target/types/fusogen';
import {
  LAMPORTS_PER_SOL,
  SystemProgram,
  Keypair,
  PublicKey,
} from '@solana/web3.js';
import {
  TOKEN_PROGRAM_ID,
  createMint,
  createAccount,
  getAssociatedTokenAddress,
  mintTo
} from '@solana/spl-token';

jest.setTimeout(30000);

const INITIAL_BALANCE = 10 * LAMPORTS_PER_SOL;
const MINT_AMOUNT = 1000;

//CONT :: cleanup this testing code



describe('fusogen', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fusogen as Program<Fusogen>;
  const user = Keypair.generate();
  const mintAccount = Keypair.generate();
  const daoA = Keypair.generate();
  const daoB = Keypair.generate();
  const daoBurnOnly = Keypair.generate();

  let daoAMint: PublicKey;
  let daoBMint: PublicKey;
  let daoBurnOnlyMint: PublicKey;

  let newTokenMint: PublicKey;
  let daoATokenAccount: PublicKey;
  let daoBTokenAccount: PublicKey;
  let daoBurnOnlyTokenAccount: PublicKey;

  async function airdropSol(connection, publicKey, amount) {
    const signature = await connection.requestAirdrop(publicKey, amount);
    await connection.confirmTransaction(signature);
  }

  async function createTokenMint(connection, payer, mintAuthority, decimals = 9) {
    return await createMint(connection, payer, mintAuthority, null, decimals);
  }

  async function createTokenAccount(connection, payer, mint, owner) {
    return await createAccount(connection, payer, mint, owner);
  }

  beforeAll(async () => {

    await airdropSol(provider.connection, daoA.publicKey, 10 * LAMPORTS_PER_SOL);
    await airdropSol(provider.connection, daoB.publicKey, 10 * LAMPORTS_PER_SOL);
    await airdropSol(provider.connection, daoBurnOnly.publicKey, 10 * LAMPORTS_PER_SOL);
    await airdropSol(provider.connection, user.publicKey, 10 * LAMPORTS_PER_SOL);

    daoAMint = await createTokenMint(provider.connection, daoA, daoA.publicKey); 
    daoBMint = await createTokenMint(provider.connection, daoB, daoB.publicKey);
    daoBurnOnlyMint = await createTokenMint(provider.connection, daoBurnOnly, daoBurnOnly.publicKey);

    daoATokenAccount = await createTokenAccount(provider.connection, daoA, daoAMint, daoA.publicKey);
    daoBTokenAccount = await createTokenAccount(provider.connection, daoB, daoBMint, daoB.publicKey);
    daoBurnOnlyTokenAccount = await createTokenAccount(provider.connection, daoBurnOnly, daoBurnOnlyMint, daoBurnOnly.publicKey);
  
    await mintTo(
      provider.connection,
      daoA,
      daoAMint,
      daoATokenAccount,
      daoA.publicKey,
      1000
    ); 

    await mintTo(
      provider.connection,
      daoB,
      daoBMint,
      daoBTokenAccount,
      daoB.publicKey,
      1000
    );

    await mintTo(
      provider.connection,
      daoBurnOnly,
      daoBurnOnlyMint,
      daoBurnOnlyTokenAccount,
      daoBurnOnly.publicKey,
      1000
    );

    newTokenMint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      10
    )

    const userBalance = await provider.connection.getBalance(user.publicKey);
    console.log(`User SOL balance: ${userBalance / LAMPORTS_PER_SOL} SOL`);

    const daoABalance = await provider.connection.getTokenAccountBalance(daoATokenAccount);
    console.log("DAO A Token Account Balance: ", daoABalance.value.amount);

    const daoBBalance = await provider.connection.getTokenAccountBalance(daoBTokenAccount);
    console.log("DAO B Token Account Balance: ", daoBBalance.value.amount);

    const daoBurnOnlyBalance = await provider.connection.getTokenAccountBalance(daoBurnOnlyTokenAccount);
    console.log("DAO Burn Only Token Account Balance: ", daoBurnOnlyBalance.value.amount);
  })

  it('Initializes the new token Mint ', async () => {
    // Add your test here.
    const tx = await program.methods
      .initializeMint()
      .accounts({
        mintAccount: mintAccount.publicKey,
        mint: newTokenMint,
        treasuryA: daoATokenAccount,
        treasuryB: daoBTokenAccount,

        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user, mintAccount])
      .rpc();
    console.log('Your transaction signature', tx);

    const mintAccountState = await program.account.mintAccount.fetch(mintAccount.publicKey);
    const derivedDaoATokenAccount = await getAssociatedTokenAddress(
      daoAMint,
      daoA.publicKey
    );
    const derivedDaoBTokenAccount = await getAssociatedTokenAddress(
      daoBMint,
      daoB.publicKey
    );

    expect(mintAccountState.exchangeRatio.toNumber()).toBe(100);
    expect(mintAccountState.treasuryA.toString()).toBe(derivedDaoATokenAccount.toString());
    expect(mintAccountState.treasuryB.toString()).toBe(derivedDaoBTokenAccount.toString());

    console.log("TreasuryA is ", mintAccountState.treasuryA.toString());
    console.log("TreasuryB is ", mintAccountState.treasuryB.toString());
  });

  it('Burns a DAOs treasury', async () => {
    // Add your test here.
    const tx = await program.methods
      .burnDaoTreasury()
      .accounts({
        treasury: daoBurnOnlyTokenAccount,
        mintTreasury: daoBurnOnlyMint,
        treasuryAuthority: daoBurnOnly.publicKey,

        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([daoBurnOnly])
      .rpc();
    console.log('Your transaction signature', tx);

    const daoBurnOnlyBalanceAfter = await provider.connection.getTokenAccountBalance(daoBurnOnlyTokenAccount);
    expect(Number(daoBurnOnlyBalanceAfter.value.amount)).toBe(0);
    console.log("DAO Burn Only Token Account Balance after burn: ", daoBurnOnlyBalanceAfter.value.amount);
  });
});
