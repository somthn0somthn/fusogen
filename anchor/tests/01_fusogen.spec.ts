import * as anchor from '@coral-xyz/anchor';
import { BN, Program } from '@coral-xyz/anchor';
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
  const daoA = Keypair.generate();
  const daoB = Keypair.generate();
  const daoBurnOnly = Keypair.generate();

  let daoAMint: PublicKey;
  let daoBMint: PublicKey;
  let daoBurnOnlyMint: PublicKey;
  let solanaDao: PublicKey;

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
      daoA,
      daoA.publicKey,
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

  it('Will merge the treasuries', async () => {
    // Add your test here.
    const tx = await program.methods
      .mergeDaoTreasuries()
      .accounts({
        newMint: newTokenMint,
        mintTreasuryA: daoAMint,
        treasuryAAta: daoATokenAccount,
        mintTreasuryB: daoBMint,
        treasuryBAta: daoBTokenAccount,
        newTreasuryAAta: daoANewTokenAccount,
        newTreasuryBAta: daoBNewTokenAccount,
        treasuryAAuthority: daoA.publicKey,
        treasuryBAuthority: daoB.publicKey,

        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([daoA, daoB])
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

  /* it('Will simulate receiving terms from Wormhole', async () => {
    const proposingDao = Buffer.alloc(32, "proposer");
    const proposedRatio = new BN(100);
    const expiry = new BN(Date.now() / 1000 + 3000);

    // First derive the PDA for the proposal account
    const [proposalPda, _bump] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("proposal"),
        provider.wallet.publicKey.toBytes()  // this matches our seeds in the instruction
      ],
      program.programId
    );

    // Send the transaction
    const tx = await program.methods
      .simulateReceiveTerms(
        proposingDao,
        proposedRatio,
        expiry
      )
      .accounts({
        payer: provider.wallet.publicKey,  
        proposal: proposalPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log('Simulated receive terms transaction:', tx);

    const proposalAccount = await program.account.proposedMerge.fetch(proposalPda);
    expect(proposalAccount.sourceChain).toBe(6); // Avalanche chain ID
    expect(proposalAccount.status).toEqual({ pending: {} });
    expect(Buffer.from(proposalAccount.terms.proposingDao)).toEqual(proposingDao);
    expect(proposalAccount.terms.proposedRatio.eq(proposedRatio)).toBe(true);
    expect(proposalAccount.terms.expiry.eq(expiry)).toBe(true);
  });

  it('Will respond to the terms with acceptance', async ()  => {
    const acceptance = true;

    const [proposalPda, _bump] = await PublicKey.findProgramAddressSync(
      [
        Buffer.from("proposal"),
        provider.wallet.publicKey.toBytes()
      ],
      program.programId
    );

    const tx = await program.methods
      .respondToTerms({
        accept: acceptance
      })
      .rpc();

    console.log('Terms responded to with acceptance tx', tx);

    const proposalAccount = await program.account.proposedMerge.fetch(proposalPda);
    expect(proposalAccount.status).toEqual({ accepted: {} });
  }); */

});
