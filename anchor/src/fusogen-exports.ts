// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { Cluster, PublicKey } from '@solana/web3.js';
import FusogenIDL from '../target/idl/fusogen.json';
import type { Fusogen } from '../target/types/fusogen';

// Re-export the generated IDL and type
export { Fusogen, FusogenIDL };

// The programId is imported from the program IDL.
export const FUSOGEN_PROGRAM_ID = new PublicKey(FusogenIDL.address);

// This is a helper function to get the Fusogen Anchor program.
export function getFusogenProgram(provider: AnchorProvider) {
  return new Program(FusogenIDL as Fusogen, provider);
}

// This is a helper function to get the program ID for the Fusogen program depending on the cluster.
export function getFusogenProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
    case 'mainnet-beta':
    default:
      return FUSOGEN_PROGRAM_ID;
  }
}
