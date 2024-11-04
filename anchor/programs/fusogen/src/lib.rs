use anchor_lang::prelude::*;
//pub mod error;
//pub mod constants;
pub mod state;
pub mod instructions;
pub mod error;

use instructions::*;
use state::*;

declare_id!("8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m");

#[program]
pub mod fusogen {
    use super::*;
    
    pub fn merge_dao_treasuries(ctx: Context<MergeTreasuries>) -> Result<()> {
        instructions::merge::merge_dao_treasuries(ctx)
    }

    pub fn simulate_receive_terms(
        ctx: Context<SimulateReceiveMergeTerms>, 
        proposing_dao: [u8; 32],
        proposed_ratio: u64,
        expiry: i64
    ) -> Result<()> {
        instructions::terms::simulate_receive_terms(ctx, proposing_dao, proposed_ratio, expiry)
    }

    pub fn respond_to_terms(
        ctx: Context<RespondToTerms>,
        accept: bool
    ) -> Result<()> {
        instructions::terms::respond_to_terms(ctx, accept)
    }

    // New instruction handlers will go here
   /*  pub fn propose_merge_terms(ctx: Context<ProposeMergeTerms>, terms: MergeTerms) -> Result<()> {
        instructions::terms::propose_merge_terms(ctx, terms)
    }

    pub fn accept_merge_terms(ctx: Context<AcceptMergeTerms>) -> Result<()> {
        instructions::terms::accept_merge_terms(ctx)
    } */
}
