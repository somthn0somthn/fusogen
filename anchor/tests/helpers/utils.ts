import { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import {
    NodeWallet,
    postVaaSolana,
    signSendAndConfirmTransaction,
  } from "@certusone/wormhole-sdk/lib/cjs/solana";
import { CORE_BRIDGE_PID, MOCK_GUARDIANS } from "./consts";
import { expect } from '@jest/globals';

export function range(size: number) { 
  return [...Array(size).keys()];
}

class SendIxError extends Error {
  logs: string;

  constructor(originalError: Error & { logs?: string[] }) {
    const logs = originalError.logs?.join('\n') || "error had no logs";
    super(originalError.message + "\nlogs:\n" + logs);
    this.stack = originalError.stack;
    this.logs = logs;
  }
}

export const boilerPlateReduction = (connection: Connection, defaultSigner: Keypair) => {
  const defaultNodeWallet = NodeWallet.fromSecretKey(defaultSigner.secretKey);

  const requestAirdrop = async (account: PublicKey) => {
    const tx = await connection.requestAirdrop(account, 1000 * LAMPORTS_PER_SOL);
    return await connection.confirmTransaction(tx);
  };
  
  const guardianSign = (message: Buffer) =>
    MOCK_GUARDIANS.addSignatures(message, [0]);

  const postSignedMsgAsVaaOnSolana = async (signedMsg: Buffer, payer?: Keypair) => {
    const wallet = payer ? NodeWallet.fromSecretKey(payer.secretKey) : defaultNodeWallet;
    await postVaaSolana(
      connection,
      wallet.signTransaction,
      CORE_BRIDGE_PID,
      wallet.key(),
      signedMsg
    );
  };

  const sendAndConfirmIx = async (
    ix: Transaction | Promise<Transaction>,
    signers: Keypair[],
  ) => {
    try {
      const tx = await ix;
      return await connection.sendTransaction(tx, signers);
    } catch (error: any) {
      throw new SendIxError(error);
    }
  };

  const expectTxToSucceed = async (promise: Promise<any>) => {
    await expect(promise).resolves.toBeDefined();
  };

  const expectIxToSucceed = async (
    ix: Transaction | Promise<Transaction>,
    signers: Keypair[],
  ) => {
    await expectTxToSucceed(sendAndConfirmIx(ix, signers));
  };

  return {
    requestAirdrop,
    guardianSign,
    postSignedMsgAsVaaOnSolana,
    sendAndConfirmIx,
    expectTxToSucceed,
    expectIxToSucceed,
  };
};