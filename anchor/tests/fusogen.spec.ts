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
  mintTo
} from '@solana/spl-token';


describe('fusogen', () => {
  const provider = anchor.AnchorProvider.local();
  anchor.setProvider(provider);

  const program = anchor.workspace.Fusogen as Program<Fusogen>;
  const user = Keypair.generate();
  const mintAccount = Keypair.generate();

  let newTokenMint: PublicKey;
  let tokenAccountA: PublicKey;
  let tokenAccountB: PublicKey;

  beforeAll(async () => {
    await provider.connection.confirmTransaction(
      await provider.connection.requestAirdrop(
        user.publicKey,
        10 * LAMPORTS_PER_SOL
      )
    );

    newTokenMint = await createMint(
      provider.connection,
      user,
      user.publicKey,
      null,
      250
    )
  })

  it('Initializes the new token Mint ', async () => {
    // Add your test here.
    const tx = await program.methods
      .initializeMint()
      .accounts({
        mintAccount: mintAccount.publicKey,
        mint: newTokenMint,
        user: user.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
      })
      .signers([user, mintAccount])
      .rpc();
    console.log('Your transaction signature', tx);
  });
});
