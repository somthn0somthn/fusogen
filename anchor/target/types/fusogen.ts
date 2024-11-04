/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/fusogen.json`.
 */
export type Fusogen = {
  "address": "J6Lyd68nbS4k4qKxgRmXShYm56hZqMVft83T5uuqdyAT",
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
    },
    {
      "name": "receiveMergeTerms",
      "discriminator": [
        119,
        251,
        194,
        127,
        85,
        48,
        150,
        107
      ],
      "accounts": [
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "wormholeProgram",
          "address": "Bridge1p5gheXUvJ6jGWGeCsgPKgnE3YgdGKRVCMY9o"
        },
        {
          "name": "postedVaa",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  80,
                  111,
                  115,
                  116,
                  101,
                  100,
                  86,
                  65,
                  65
                ]
              },
              {
                "kind": "arg",
                "path": "vaaHash"
              }
            ],
            "program": {
              "kind": "account",
              "path": "wormholeProgram"
            }
          }
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "postedVaa"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "vaaHash",
          "type": {
            "array": [
              "u8",
              32
            ]
          }
        }
      ]
    },
    {
      "name": "respondToTerms",
      "discriminator": [
        58,
        133,
        159,
        213,
        1,
        249,
        236,
        199
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "proposal",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  114,
                  111,
                  112,
                  111,
                  115,
                  97,
                  108
                ]
              },
              {
                "kind": "account",
                "path": "authority"
              }
            ]
          }
        }
      ],
      "args": [
        {
          "name": "accept",
          "type": "bool"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "proposedMerge",
      "discriminator": [
        133,
        49,
        98,
        10,
        127,
        195,
        185,
        218
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "proposalNotPending",
      "msg": "Proposal is not in pending status"
    },
    {
      "code": 6001,
      "name": "invalidEmitterChain",
      "msg": "Invalid emitter chain ID"
    },
    {
      "code": 6002,
      "name": "invalidVaaPayload",
      "msg": "Failed to parse VAA payload"
    },
    {
      "code": 6003,
      "name": "proposalExpired",
      "msg": "Proposal has expired"
    }
  ],
  "types": [
    {
      "name": "mergeTerms",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "proposingDao",
            "type": {
              "array": [
                "u8",
                32
              ]
            }
          },
          {
            "name": "proposedRatio",
            "type": "u64"
          },
          {
            "name": "expiry",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "proposalStatus",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "pending"
          },
          {
            "name": "accepted"
          },
          {
            "name": "declined"
          }
        ]
      }
    },
    {
      "name": "proposedMerge",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "sourceChain",
            "type": "u16"
          },
          {
            "name": "terms",
            "type": {
              "defined": {
                "name": "mergeTerms"
              }
            }
          },
          {
            "name": "status",
            "type": {
              "defined": {
                "name": "proposalStatus"
              }
            }
          }
        ]
      }
    }
  ]
};
