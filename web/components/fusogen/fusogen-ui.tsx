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

  // State for collecting input for treasury merging
  const [mintTreasuryA, setMintTreasuryA] = useState('');
  const [treasuryAAta, setTreasuryAAta] = useState('');
  const [mintTreasuryB, setMintTreasuryB] = useState('');
  const [treasuryBAta, setTreasuryBAta] = useState('');
  const [newMint, setNewMint] = useState('');
  const [newTreasuryAAta, setNewTreasuryAAta] = useState('');
  const [newTreasuryBAta, setNewTreasuryBAta] = useState('');
  const [secondWalletAddress, setSecondWalletAddress] = useState(''); // state for second wallet public key

  // Handler for signing the transaction with the first wallet
  const handleFirstSigner = async () => {
    try {
      const mintTreasuryAPubkey = new PublicKey(mintTreasuryA);
      const treasuryAAtaPubkey = new PublicKey(treasuryAAta);
      const mintTreasuryBPubkey = new PublicKey(mintTreasuryB);
      const treasuryBAtaPubkey = new PublicKey(treasuryBAta);
      const newMintPubkey = new PublicKey(newMint);
      const newTreasuryAAtaPubkey = new PublicKey(newTreasuryAAta);
      const newTreasuryBAtaPubkey = new PublicKey(newTreasuryBAta);
      const secondMintAuthority = new PublicKey(secondWalletAddress);

      // Step 1: Create the transaction for merging DAOs
      const transaction = await createTransaction(
        mintTreasuryAPubkey,
        treasuryAAtaPubkey,
        mintTreasuryBPubkey,
        treasuryBAtaPubkey,
        newMintPubkey,
        newTreasuryAAtaPubkey,
        newTreasuryBAtaPubkey,
        provider.wallet.publicKey, // First authority
        secondMintAuthority, // Second authority, e.g. the second wallet
        program,
        connection
      );

      // Step 2: Sign the transaction with the first wallet (wallet.publicKey)
      await signTransaction(transaction, wallet);

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
          placeholder="Mint Treasury A"
          value={mintTreasuryA}
          onChange={(e) => setMintTreasuryA(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Treasury A ATA"
          value={treasuryAAta}
          onChange={(e) => setTreasuryAAta(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Mint Treasury B"
          value={mintTreasuryB}
          onChange={(e) => setMintTreasuryB(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="Treasury B ATA"
          value={treasuryBAta}
          onChange={(e) => setTreasuryBAta(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="New Mint"
          value={newMint}
          onChange={(e) => setNewMint(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="New Treasury A ATA"
          value={newTreasuryAAta}
          onChange={(e) => setNewTreasuryAAta(e.target.value)}
        />
      </div>
      <div>
        <input
          type="text"
          className="input input-bordered w-full"
          placeholder="New Treasury B ATA"
          value={newTreasuryBAta}
          onChange={(e) => setNewTreasuryBAta(e.target.value)}
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