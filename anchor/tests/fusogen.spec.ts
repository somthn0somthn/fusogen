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


describe('fusogen', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fusogen as Program<Fusogen>;
  const user = Keypair.generate();
  const mintAccount = Keypair.generate();
  const daoA = Keypair.generate();
  const daoB = Keypair.generate();

  let daoAMint: PublicKey;
  let daoBMint: PublicKey;

  let newTokenMint: PublicKey;
  let daoATokenAccount: PublicKey;
  let daoBTokenAccount: PublicKey;

  
  beforeAll(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        daoA.publicKey,
        10 * LAMPORTS_PER_SOL
      )
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        daoB.publicKey,
        10 * LAMPORTS_PER_SOL
      )
    );

    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        user.publicKey,
        10 * LAMPORTS_PER_SOL
      )
    );

    daoAMint = await createMint(
      provider.connection,
      daoA,
      daoA.publicKey,
      null,
      10
    )

    daoBMint = await createMint(
      provider.connection,
      daoB,
      daoB.publicKey,
      null,
      10
    )

    daoATokenAccount = await createAccount(
      provider.connection,
      daoA,
      daoAMint,
      daoA.publicKey,
    )

    daoBTokenAccount = await createAccount(
      provider.connection,
      daoB,
      daoBMint,
      daoB.publicKey,
    )

    //verify ATA balances somewhere for thoroughness sake???

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

    newTokenMint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      10
    )
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
});
