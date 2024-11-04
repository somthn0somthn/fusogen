use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Proposal is not in pending status")]
    ProposalNotPending,
}