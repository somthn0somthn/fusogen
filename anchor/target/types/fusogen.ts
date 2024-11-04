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
    },
    {
      "name": "simulateReceiveTerms",
      "discriminator": [
        103,
        246,
        159,
        81,
        45,
        121,
        222,
        50
      ],
      "accounts": [
        {
          "name": "payer",
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
                "path": "payer"
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
