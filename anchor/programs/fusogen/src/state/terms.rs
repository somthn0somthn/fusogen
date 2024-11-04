use anchor_lang::prelude::*;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug)]
pub struct MergeTerms {
    pub proposing_dao: [u8; 32],
    pub proposed_ratio: u64,
    pub expiry: i64,
}

#[account]
pub struct ProposedMerge {
    pub source_chain: u16,
    pub terms: MergeTerms,
    pub status: ProposalStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum ProposalStatus {
    Pending,
    Accepted,
    Declined,
}