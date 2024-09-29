'use client';

import { getFusogenProgram, getFusogenProgramId } from '@fusogen/anchor';
import { Program } from '@coral-xyz/anchor';
import { useConnection } from '@solana/wallet-adapter-react';
import { Cluster, Keypair, PublicKey } from '@solana/web3.js';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useCluster } from '../cluster/cluster-data-access';
import { useAnchorProvider } from '../solana/solana-provider';
import { useTransactionToast } from '../ui/ui-layout';

export function useFusogenProgram() {
  const { connection } = useConnection();
  const { cluster } = useCluster();
  const transactionToast = useTransactionToast();
  const provider = useAnchorProvider();
  const programId = useMemo(
    () => getFusogenProgramId(cluster.network as Cluster),
    [cluster]
  );
  const program = getFusogenProgram(provider);

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  });

  const greet = useMutation({
    mutationKey: ['fusogen', 'greet', { cluster }],
    mutationFn: async ({ mint, ata, user1, user2 }: { mint: PublicKey, ata: PublicKey, user1: Keypair, user2: Keypair }) => 
      program.methods
        .greet()
        .accounts({
          mint,
          ata,
          user1: user1.publicKey,  // Signer 1
          user2: user2.publicKey,  // Signer 2
        })
        .signers([user1, user2]) // Adding signers here
        .rpc(),
    onSuccess: (signature) => {
      transactionToast(signature);
    },
    onError: () => toast.error('Failed to run the program'),
  });

  return {
    program,
    programId,
    getProgramAccount,
    greet,
  };
}
