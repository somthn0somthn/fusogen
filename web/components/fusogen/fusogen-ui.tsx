'use client';

import { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useFusogenProgram } from './fusogen-data-access';
import { useFusogenTransactions } from './fusogen-transaction-manager'; // import the transaction manager
import { useAnchorProvider } from '../solana/solana-provider';
import { useWallet, useConnection } from '@solana/wallet-adapter-react'; // to interact with the current wallet

export function FusogenCreate() {
  const { createTransaction, signTransaction, loadTransaction, submitTransaction } = useFusogenTransactions();
  const wallet = useWallet(); // get the active wallet for signing
  const provider = useAnchorProvider();
  const { program } = useFusogenProgram(); // Get program from hook
  const { connection } = useConnection(); // Get connection

  const [mintAddress, setMintAddress] = useState('');
  const [ataAddress, setAtaAddress] = useState('');
  const [secondWalletAddress, setSecondWalletAddress] = useState(''); // state for second wallet public key

  // Handler for signing the transaction with the first wallet
  const handleFirstSigner = async () => {
    try {
      const mint = new PublicKey(mintAddress);
      const ata = new PublicKey(ataAddress);

      // Step 1: Create the transaction
      const transaction = await createTransaction(mint, ata, provider.wallet.publicKey, new PublicKey(secondWalletAddress), program, connection);

      // Step 2: Sign the transaction with the first wallet (wallet.publicKey)
      await signTransaction(transaction, wallet);

      /* // Step 3: Store the partially signed transaction in localStorage
      localStorage.setItem('fusogen-partial-transaction', signedTransaction.serialize().toString('base64')); */

      console.log("First signature added, transaction stored locally.");

    } catch (err) {
      console.error("Error during first signer step:", err);
    }
  };

  // Handler for signing the transaction with the second wallet
  const handleSecondSigner = async () => {
    try {
      // Step 1: Load the partially signed transaction from localStorage
      const transaction = await loadTransaction();

      console.log("LOADED TRANSACTION IS ", transaction);

      // Step 2: Sign the transaction with the second wallet (after switching wallets)
      const signedTransaction = await signTransaction(transaction, wallet);

      console.log("TRANSACTION SIGNED SECOND TIME");

      // Step 3: Submit the fully signed transaction to the network
      await submitTransaction(connection, signedTransaction);

      console.log("Transaction fully signed and submitted.");
    } catch (err) {
      console.error("Error during second signer step:", err);
    }
  };

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

      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Enter Second Wallet Public Key"
          value={secondWalletAddress}
          onChange={(e) => setSecondWalletAddress(e.target.value)}
        />
      </div>

      {/* First signer button */}
      <button
        className="btn btn-xs lg:btn-md btn-primary"
        onClick={handleFirstSigner}
        disabled={wallet.connecting || wallet.disconnecting}
      >
        Sign with First Wallet
      </button>

      {/* Second signer button */}
      <button
        className="btn btn-xs lg:btn-md btn-secondary"
        onClick={handleSecondSigner}
        disabled={wallet.connecting || wallet.disconnecting}
      >
        Sign with Second Wallet
      </button>
    </div>
  );
}

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