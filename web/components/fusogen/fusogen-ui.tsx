'use client';

import { useState } from 'react';
import { Keypair, PublicKey } from '@solana/web3.js';
import { useFusogenProgram } from './fusogen-data-access';
import { useAnchorProvider } from '../solana/solana-provider';

export function FusogenCreate() {
  const { greet } = useFusogenProgram();

  const [mintAddress, setMintAddress] = useState('');
  const [ataAddress, setAtaAddress] = useState('');

  const handleGreet = () => {
    try {
      const mint = new PublicKey(mintAddress);
      const ata = new PublicKey(ataAddress);

      greet.mutateAsync({
        mint,
        ata,
      });
    } catch (err) {
      console.error("Invalid public key format", err);
    }
  };

  //CONT
  //TODO::remove these hardcoded values into the UI so that the user can provide them through the ui
  //and ensure it continues to work

  //NOTE:: these values are a bit of a pain to get - you have to start a local validator, run the test script
  //locally, get these values from the output, then C&P here - updating each time you start a new local validator
  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Mint Address"
          value={mintAddress}
          onChange={(e) => setMintAddress(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter ATA Address"
          value={ataAddress}
          onChange={(e) => setAtaAddress(e.target.value)}
        />
      </div>
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleGreet}
        disabled={greet.isPending}
      >
        Run program{greet.isPending && '...'}
      </button>
    </div>
  );
}
/* onClick={() => greet.mutateAsync({
          mint: provider.wallet.publicKey,
          ata: Keypair.generate().publicKey
        })} */
export function FusogenProgram() {
  const { getProgramAccount } = useFusogenProgram();

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>;
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>
          Program account not found. Make sure you have deployed the program and
          are on the correct cluster.
        </span>
      </div>
    );
  }
  return (
    <div className={'space-y-6'}>
      <pre>{JSON.stringify(getProgramAccount.data.value, null, 2)}</pre>
    </div>
  );
}
