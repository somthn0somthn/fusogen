# fusogen

## What's Fusogen

Fusogen is a platform designed to facilitate mergers and acquisitions (M&A) like actions for decentralized autonomous organizations (DAOs). As decentralized communities and blockchain-based entities grow, there is a growing need for DAOs to consolidate resources, collaborate, and merge effectively—much like traditional businesses. However, DAOs operate under different rules, relying on smart contracts and decentralized governance, so traditional M&A processes don’t apply. Fusogen addresses this gap by providing a framework to streamline the merging of DAOs, allowing them to combine assets, governance structures, and treasuries in a secure and automated manner. Simply put, Fusogen faciliates fair and secure value sharing across communities as they grow and evolve.

## About the Application

The Fusogen App is currently in a proof-of-concept status. The PoC demo approximately mimics a real-world "Merger of Equals," wherein two firms join forming a single new entity. Each community surrenders its original shares to receive new shares representing their combined enterprise. This is represnted on Fusogen as two DAOs burning the assets in their treasury in order to receive a newly created asset. See the [Loom presentation](https://www.loom.com/share/643e4931f83f4ee299340a81234b12cc?sid=d5d0b95c-6600-42e0-a725-f73b79e7e206) for a quick overview & demo.

Fusogen was born September 15th, following the [Summer Encode Solana Bootcamp](https://www.encode.club/solana-summer-bootcamp), and deployed to meet the Solana Colosseum Hackathon. Owing to this quick turnaround, the UI has some rough corners, but should still be simple enough to use for users familiar with the terminal and general Solana tools.Currently, the design is naive, require the user to manually enter account information. This will be refactored away shortly, but currently this repo contians scripts to make this process smooth. Setting up the scripts requires some basic setup, which is explained below.


## Getting Started

Fusogen is live on devnet! You can see by following the url: [fusogen.io](fusogen.io). The easisiest way to interact with it in a test capacity is likely through cloning this repo locally, setting up a few environmental variables, and running a few scripts. You can also build Fusogen locally, run a local test validator, and interact with via your local setup. The choice is yours, just make sure the wallets your are using are pointed at the appropriate cluster - finally, a live demo video is also availabe via this [Loom presentation](https://www.loom.com/share/643e4931f83f4ee299340a81234b12cc?sid=d5d0b95c-6600-42e0-a725-f73b79e7e206).

Two interact with Fusogen, you will need:
- some basically familiarity with the command line, Solana, and general web3 UI.
- two test wallets - be sure these are test wallets. Its best if the can be pointed at your local validator or a custom rpc endpoint. Phantom and Backpack both accomplish this easily enough, IMO.
- some test SOL - you can airdrop to yourself for localnet or use the Devnet faucet [here](https://faucet.solana.com/).

## Using Scripts for the Devnet Demo

The scripts require your to include your private keys in your `.env` file. They can be taken from your test wallets easily enough, and should be formatted like this in your `.env`:

```code
#wallet 1
SECRET_PHRASE_ONE=apple banana orange mango grape lemon kiwi tomato cucumber lettuce carrot melon
```

```code
#wallet 2
SECRET_PHRASE_TWO=lion tiger elephant giraffe panda zebra monkey rabbit dolphin eagle fox cat
```

Be sure to add your `.env` to your `.gitignore`, especially if you will be pushing this remotely. Exposing these keys will compromise your wallet and its funds, so its 100% critical these be test wallets + test funds and should hold no real value or in no way be used for real interactions with mainnet. These wallets affectively act as the signing authority for the DAOs and their treasuries, which is why the scripts require them. 

Finally, run the scripts using npx esrun in this order

```shell
$npx esrun mintA-startup-from-secret.tsx
$npx esrun mintB-startup-from-secret.tsx
$npx esrun create-new-mint.tsx
```

Collect the outputted newly create account addresses, input them into the Fusogen app, and sign with both wallets. You will need to switch wallets on your browser after signing with the first, but you do not need to reinput the account info into the form fields. This is because the transaciton is partially-signed, serialized, and stored locally. The second wallet already has a trasaction with the required info, and only needs to sign in order to submit. You can see the transaction output by using the browser console and check on your favorite explored.

## Building the App locally

### Prerequisites

- Node v18.18.0 or higher

- Rust v1.77.2 or higher
- Anchor CLI 0.30.1 or higher
- Solana CLI 1.18.17 or higher

### Installation

#### Clone the repo

```shell
git clone https://github.com/somthn0somthn/fusogen.git
cd fusogen
```

#### Install Dependencies

```shell
npm install
```

#### Start the web app

```
npm run dev
```

## Apps

### anchor

This is a Solana program written in Rust using the Anchor framework.

#### Commands

You can use any normal anchor commands. Either move to the `anchor` directory and run the `anchor` command or prefix the command with `npm run`, eg: `npm run anchor`.

#### Sync the program id:

Running this command will create a new keypair in the `anchor/target/deploy` directory and save the address to the Anchor config file and update the `declare_id!` macro in the `./src/lib.rs` file of the program.

You will manually need to update the constant in `anchor/lib/basic-exports.ts` to match the new program id.

```shell
npm run anchor keys sync
```

#### Build the program:

```shell
npm run anchor-build
```

#### Start the test validator with the program deployed:

```shell
npm run anchor-localnet
```

#### Run the tests

```shell
npm run anchor-test
```

#### Deploy to Devnet

```shell
npm run anchor deploy --provider.cluster devnet
```

### web

This is a React app that uses the Anchor generated client to interact with the Solana program.

#### Commands

Start the web app

```shell
npm run dev
```

Build the web app

```shell
npm run build
```
