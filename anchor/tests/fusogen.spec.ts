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


describe('fusogen', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fusogen as Program<Fusogen>;
  const user = Keypair.generate();
  const mergeAccount = Keypair.generate();
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
  let daoANewTokenAccount: PublicKey;
  let daoBNewTokenAccount: PublicKey;

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
    newTokenMint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      10
    )


    daoATokenAccount = await createTokenAccount(provider.connection, daoA, daoAMint, daoA.publicKey);
    daoBTokenAccount = await createTokenAccount(provider.connection, daoB, daoBMint, daoB.publicKey);
    daoBurnOnlyTokenAccount = await createTokenAccount(provider.connection, daoBurnOnly, daoBurnOnlyMint, daoBurnOnly.publicKey);
    daoANewTokenAccount = await createTokenAccount(provider.connection, daoA, newTokenMint, daoA.publicKey);
    daoBNewTokenAccount = await createTokenAccount(provider.connection, daoB, newTokenMint, daoB.publicKey);

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


    const userBalance = await provider.connection.getBalance(user.publicKey);
    console.log(`User SOL balance: ${userBalance / LAMPORTS_PER_SOL} SOL`);

    console.log(`DAO A MINT IS `, daoAMint)

    console.log(`DAO A MINT ATA`, daoATokenAccount)

    const daoABalance = await provider.connection.getTokenAccountBalance(daoATokenAccount);
    console.log("DAO A Token Account Balance: ", daoABalance.value.amount);

    const daoBBalance = await provider.connection.getTokenAccountBalance(daoBTokenAccount);
    console.log("DAO B Token Account Balance: ", daoBBalance.value.amount);

    const daoBurnOnlyBalance = await provider.connection.getTokenAccountBalance(daoBurnOnlyTokenAccount);
    console.log("DAO Burn Only Token Account Balance: ", daoBurnOnlyBalance.value.amount);

    const daoANewTokenBalance = await provider.connection.getTokenAccountBalance(daoANewTokenAccount);
    console.log("DAO A **NEW** Token Account Balance: ", daoANewTokenBalance.value.amount);

    const daoBNewTokenBalance = await provider.connection.getTokenAccountBalance(daoBNewTokenAccount);
    console.log("DAO B **NEW** Token Account Balance: ", daoBNewTokenBalance.value.amount);
  })

  it('Initializes the new token Mint ', async () => {
    // Add your test here.
    const tx = await program.methods
      .initializeMint()
      .accounts({
        mergeAccount: mergeAccount.publicKey,
        mint: newTokenMint,
        treasuryA: daoATokenAccount,
        treasuryB: daoBTokenAccount,

        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user, mergeAccount])
      .rpc();
    console.log('Your transaction signature', tx);

    const mergeAccountState = await program.account.mergeAccount.fetch(mergeAccount.publicKey);
    const derivedDaoATokenAccount = await getAssociatedTokenAddress(
      daoAMint,
      daoA.publicKey
    );
    const derivedDaoBTokenAccount = await getAssociatedTokenAddress(
      daoBMint,
      daoB.publicKey
    );

    expect(mergeAccountState.exchangeRatio.toNumber()).toBe(100);
    expect(mergeAccountState.treasuryA.toString()).toBe(derivedDaoATokenAccount.toString());
    expect(mergeAccountState.treasuryB.toString()).toBe(derivedDaoBTokenAccount.toString());

    console.log("TreasuryA is ", mergeAccountState.treasuryA.toString());
    console.log("TreasuryB is ", mergeAccountState.treasuryB.toString());
  });

  it('Greets', async () => {
    // Add your test here.
    const tx = await program.methods
      .greet()
      .accounts({
        mint: daoAMint,
        ata: daoATokenAccount,
      })
      .rpc();
    console.log('Your transaction signature', tx);

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

  it('Will merge the treasuries', async () => {
    // Add your test here.
    const tx = await program.methods
      .mergeDaoTreasury()
      .accounts({
        newMint: newTokenMint,
        mintTreasuryA: daoAMint,
        treasuryAAta: daoATokenAccount,
        mintTreasuryB: daoBMint,
        treasuryBAta: daoBTokenAccount,
        newTreasuryAAta: daoANewTokenAccount,
        newTreasuryBAta: daoBNewTokenAccount,
        user: user.publicKey,
        treasuryAAuthority: daoA.publicKey,
        treasuryBAuthority: daoB.publicKey,

        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([daoA, daoB, user])
      .rpc();
    console.log('Your transaction signature', tx);

    const daoABalanceAfter = await provider.connection.getTokenAccountBalance(daoATokenAccount);
    expect(Number(daoABalanceAfter.value.amount)).toBe(0);

    const daoBBalanceAfter = await provider.connection.getTokenAccountBalance(daoBTokenAccount);
    expect(Number(daoBBalanceAfter.value.amount)).toBe(0);

    const daoANewTokenBalanceAfter = await provider.connection.getTokenAccountBalance(daoANewTokenAccount);
    expect(Number(daoANewTokenBalanceAfter.value.amount)).toBe(123);  // or whatever amount you minted

    const daoBNewTokenBalanceAfter = await provider.connection.getTokenAccountBalance(daoBNewTokenAccount);
    expect(Number(daoBNewTokenBalanceAfter.value.amount)).toBe(456);

    console.log("DAO A Token Account Balance after burn: ", daoABalanceAfter.value.amount);
    console.log("DAO B Token Account Balance after burn: ", daoBBalanceAfter.value.amount);
    console.log("DAO A ::NEW:: Token Account Balance after burn: ", daoANewTokenBalanceAfter.value.amount);
    console.log("DAO B ::NEW:: Token Account Balance after burn: ", daoBNewTokenBalanceAfter.value.amount);
  });
});
