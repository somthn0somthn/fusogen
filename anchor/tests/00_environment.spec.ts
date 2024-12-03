import { Connection, PublicKey, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { expect, describe, it, beforeAll } from '@jest/globals';
import {
  createMint,
  getAccount,
  getAssociatedTokenAddressSync,
  getMint,
  getOrCreateAssociatedTokenAccount,
  mintTo,
} from "@solana/spl-token";
import {
  createWrappedOnSolana,
  redeemOnSolana,
  transferNativeSol,
  tryNativeToHexString,
  CHAINS,
} from "@certusone/wormhole-sdk";
import * as wormhole from "@certusone/wormhole-sdk/lib/cjs/solana/wormhole";
import {
  LOCALHOST,
  MINTS_WITH_DECIMALS, 
  PAYER_KEYPAIR,
  RELAYER_KEYPAIR,
  boilerPlateReduction,
  CORE_BRIDGE_PID,
  TOKEN_BRIDGE_PID,
} from "./helpers";

describe("Wormhole Environment Setup", () => {
  const connection = new Connection(LOCALHOST, "processed");
  const { requestAirdrop } = boilerPlateReduction(connection, PAYER_KEYPAIR);

  beforeAll(async () => {
    await Promise.all([PAYER_KEYPAIR, RELAYER_KEYPAIR].map(kp => 
      requestAirdrop(kp.publicKey)
    ));
  });

  describe("Verify Local Validator", () => {
    it("Should create SPL tokens", async () => {
      await Promise.all(
        Array.from(MINTS_WITH_DECIMALS.entries()).map(
          async ([mintDecimals, {privateKey, publicKey}]) => {
            const mint = await createMint(
              connection,
              PAYER_KEYPAIR,
              PAYER_KEYPAIR.publicKey,
              null,
              mintDecimals,
              Keypair.fromSecretKey(privateKey)
            );
            expect(mint).toEqual(publicKey);

            const { decimals } = await getMint(connection, mint);

            console.log("TEH DECIMALS", decimals)
            expect(decimals).toBe(mintDecimals);
          }
        )
      );
    });

    // Add more tests as needed
  });
});