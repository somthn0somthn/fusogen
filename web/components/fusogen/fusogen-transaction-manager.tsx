import { Transaction, PublicKey } from '@solana/web3.js';
import { useFusogenProgram } from './fusogen-data-access'; // import program for methods
import { useConnection, WalletContextState } from '@solana/wallet-adapter-react'; // to get the connection from the wallet adapter

export function useFusogenTransactions() {

    async function createTransaction(mint: PublicKey, ata: PublicKey, user1: PublicKey, user2: PublicKey, program: any, connection: any) {
        const transaction = new Transaction();

        const { blockhash } = await connection.getLatestBlockhash();
        console.log("BLOCKHASh IS ", blockhash);
        
        transaction.recentBlockhash = blockhash;
        transaction.feePayer = user2;

        transaction.add(
            await program.methods.greet()
            .accounts({
                mint, 
                ata, 
                user1,
                user2,
            })
            .instruction()
        );
        console.log("Transaction signatures after signing from create Transaction:", transaction.signatures);

        const serializedTransaction = transaction.serialize({
            requireAllSignatures: false,
        });
        

        console.log("TRANSACTION SERIALIZED AND STORED LOCALLY")

        return transaction;
    }

    async function loadTransaction() {
        const serializedTx = localStorage.getItem('fusogen-transaction');
        if (!serializedTx) {
            throw new Error('No transaction found in localStorage');
        }

        const transaction = Transaction.from(Buffer.from(serializedTx, 'base64'));
        console.log("Transaction signatures after signing from loadTransaction:", transaction.signatures);

        return transaction;
    }

    async function signTransaction(transaction: Transaction, wallet: WalletContextState) {
        if (wallet.signTransaction) {
            const signedTransaction = await wallet.signTransaction(transaction);
            const serializedTransaction = signedTransaction.serialize({
                requireAllSignatures: false,
            });
            console.log("Transaction signatures after signing frrom signTransaction:", transaction.signatures);

            console.log("saved transaction is ", Transaction.from(serializedTransaction));
            localStorage.setItem('fusogen-transaction', serializedTransaction.toString('base64'));
            console.log("SIGNATURE WENT OK")
            return signedTransaction;
        } else {
            throw new Error('Wallet does not support transaction signing');
        }
    }

    async function submitTransaction(connection: any, signedTransaction: Transaction) {
        const txId = await connection.sendRawTransaction(signedTransaction.serialize());

        console.log('Transaction sent with ID:', txId);

        localStorage.removeItem('fusogen-transaction');
    }

    return {
        createTransaction,
        signTransaction,
        loadTransaction,
        submitTransaction,
    };
}
