use anchor_lang::prelude::*;
use crate::state::*;
use crate::error::*;

#[derive(Accounts)]
pub struct SimulateReceiveMergeTerms<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,  

    #[account(
        init, 
        payer = payer,
        space = 8 + std::mem::size_of::<ProposedMerge>(),
        seeds = ["proposal".as_bytes(), &payer.key().to_bytes()],
        bump
    )]
    pub proposal: Account<'info, ProposedMerge>,

    pub system_program: Program<'info, System>,
}

pub fn simulate_receive_terms(
    ctx: Context<SimulateReceiveMergeTerms>,
    proposing_dao: [u8; 32],
    proposed_ratio: u64,
    expiry: i64,
) -> Result<()> {
    let terms = MergeTerms {
        proposing_dao,
        proposed_ratio,
        expiry,
    };

    let proposal = &mut ctx.accounts.proposal; 
    proposal.source_chain = 6; 
    proposal.terms = terms;
    proposal.status = ProposalStatus::Pending;

    Ok(())
}

#[derive(Accounts)]
pub struct RespondToTerms<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        mut, 
        seeds = ["proposal".as_bytes(), &authority.key().to_bytes()],  
        bump
    )]
    pub proposal: Account<'info, ProposedMerge>,
}

pub fn respond_to_terms(
    ctx: Context<RespondToTerms>,
    accept: bool,
) -> Result<()> {
    let proposal = &mut ctx.accounts.proposal;

    require!(
        proposal.status == ProposalStatus::Pending,
        CustomError::ProposalNotPending
    );

    proposal.status = if accept {
        ProposalStatus::Accepted
    } else {
        ProposalStatus::Declined
    };

    Ok(())
}