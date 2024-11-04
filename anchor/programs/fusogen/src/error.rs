use anchor_lang::prelude::*;

#[error_code]
pub enum CustomError {
    #[msg("Proposal is not in pending status")]
    ProposalNotPending,
    // TODO :: refactor if you expand beyond Avalanche
    #[msg("Invalid emitter chain ID")]
    InvalidEmitterChain,
    #[msg("Failed to parse VAA payload")]
    InvalidVaaPayload,
    #[msg("Proposal has expired")]
    ProposalExpired,
}