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
      "name": "burnDaoTreasury",
      "discriminator": [
        59,
        110,
        98,
        25,
        52,
        41,
        137,
        64
      ],
      "accounts": [
        {
          "name": "treasury",
          "writable": true
        },
        {
          "name": "mintTreasury",
          "writable": true
        },
        {
          "name": "treasuryAuthority",
          "signer": true
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "greet",
      "discriminator": [
        203,
        194,
        3,
        150,
        228,
        58,
        181,
        62
      ],
      "accounts": [
        {
          "name": "mint"
        },
        {
          "name": "ata"
        },
        {
          "name": "user1",
          "signer": true
        },
        {
          "name": "user2",
          "signer": true
        }
      ],
      "args": []
    },
    {
      "name": "initializeMint",
      "discriminator": [
        209,
        42,
        195,
        4,
        129,
        85,
        209,
        44
      ],
      "accounts": [
        {
          "name": "mergeAccount",
          "writable": true,
          "signer": true
        },
        {
          "name": "mint",
          "writable": true
        },
        {
          "name": "treasuryA",
          "writable": true
        },
        {
          "name": "treasuryB",
          "writable": true
        },
        {
          "name": "user",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "rent",
          "address": "SysvarRent111111111111111111111111111111111"
        },
        {
          "name": "tokenProgram",
          "address": "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
        }
      ],
      "args": []
    },
    {
      "name": "mergeDaoTreasury",
      "discriminator": [
        187,
        238,
        241,
        213,
        229,
        182,
        144,
        139
      ],
      "accounts": [
        {
          "name": "newMint",
          "writable": true
        },
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
          "name": "newTreasuryAAta",
          "writable": true
        },
        {
          "name": "newTreasuryBAta",
          "writable": true
        },
        {
          "name": "user",
          "signer": true
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
  ],
  "accounts": [
    {
      "name": "mergeAccount",
      "discriminator": [
        53,
        217,
        71,
        70,
        115,
        27,
        7,
        64
      ]
    }
  ],
  "types": [
    {
      "name": "mergeAccount",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "exchangeRatio",
            "type": "u64"
          },
          {
            "name": "mint",
            "type": "pubkey"
          },
          {
            "name": "treasuryA",
            "type": "pubkey"
          },
          {
            "name": "treasuryB",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
