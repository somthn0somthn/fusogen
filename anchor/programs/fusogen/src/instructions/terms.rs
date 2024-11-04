use anchor_lang::prelude::*;
use wormhole_anchor_sdk::wormhole;
use wormhole_anchor_sdk::wormhole::program::Wormhole;
use crate::state::*;
use crate::error::*;
use crate::message::FusogenMessage;

// Define the VAA type
type FusogenVaa = wormhole::PostedVaa<FusogenMessage>;

#[derive(Accounts)]
#[instruction(vaa_hash: [u8; 32])]
pub struct ReceiveMergeTerms<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    pub wormhole_program: Program<'info, wormhole::program::Wormhole>,

    #[account(
        seeds = [
            wormhole::SEED_PREFIX_POSTED_VAA,
            &vaa_hash
        ],
        bump,
        seeds::program = wormhole_program.key()
    )]
    pub posted_vaa: Account<'info, FusogenVaa>,

    #[account(
        init,
        payer = payer,
        space = 8 + std::mem::size_of::<ProposedMerge>(),
        seeds = ["proposal".as_bytes(), &posted_vaa.emitter_chain().to_le_bytes()],
        bump
    )]
    pub proposal: Account<'info, ProposedMerge>,

    pub system_program: Program<'info, System>,
}

pub fn receive_merge_terms(
    ctx: Context<ReceiveMergeTerms>,
    vaa_hash: [u8; 32]
) -> Result<()> {
    let vaa = &ctx.accounts.posted_vaa;

    let clock = Clock::get()?;
    
    require!(
        vaa.emitter_chain() == 6,
        CustomError::InvalidEmitterChain
    );

    // Get the cloned data from the VAA
    let FusogenMessage::MergeTerms { 
        proposing_dao,
        proposed_ratio,
        expiry 
    } = vaa.data().clone();

    require!(
        clock.unix_timestamp < expiry,
        CustomError::ProposalExpired
    );

    let proposal = &mut ctx.accounts.proposal;
    proposal.source_chain = vaa.emitter_chain();
    proposal.terms = MergeTerms {
        proposing_dao,
        proposed_ratio,
        expiry,
    };
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
    let clock = Clock::get()?;

    require!(
        proposal.status == ProposalStatus::Pending,
        CustomError::ProposalNotPending
    );

    require!(
        clock.unix_timestamp < proposal.terms.expiry,
        CustomError::ProposalExpired
    );

    proposal.status = if accept {
        ProposalStatus::Accepted
    } else {
        ProposalStatus::Declined
    };

    Ok(())
}