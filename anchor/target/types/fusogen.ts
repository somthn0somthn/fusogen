/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fusogen.json`.
 */
export type Fusogen = {
  "address": "8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m",
  "metadata": {
    "name": "fusogen",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "mergeDaoTreasuries",
      "discriminator": [
        19,
        135,
        208,
        28,
        164,
        212,
        207,
        98
      ],
      "accounts": [
        {
          "name": "mintTreasuryA",
          "writable": true
        },
        {
          "name": "treasuryAAta",
          "writable": true
        },
        {
          "name": "mintTreasuryB",
          "writable": true
        },
        {
          "name": "treasuryBAta",
          "writable": true
        },
        {
          "name": "newMint",
          "writable": true
        },
        {
          "name": "newTreasuryAAta",
          "writable": true
        },
        {
          "name": "newTreasuryBAta",
          "writable": true
        },
        {
          "name": "treasuryAAuthority",
          "signer": true
        },
        {
          "name": "treasuryBAuthority",
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    }
  ]
};
