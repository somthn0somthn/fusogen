use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, MintTo, Token, TokenAccount, Transfer};

declare_id!("8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m");

#[program]
pub mod fusogen {
    use super::*;

    pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
        let mint_account = &mut ctx.accounts.mint_account;
        let exchange_ratio: u64 = 100;
        mint_account.exchange_ratio = exchange_ratio;
        mint_account.mint = ctx.accounts.mint.key();
        mint_account.treasury_a = ctx.accounts.treasury_a.key();
        mint_account.treasury_b = ctx.accounts.treasury_b.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32 + 32 + 32)]
    pub mint_account: Account<'info, MintAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub treasury_a: Account<'info, TokenAccount>,
    #[account(mut)]
    pub treasury_b: Account<'info, TokenAccount>,
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct MintAccount {
    pub exchange_ratio: u64,
    pub mint: Pubkey,
    pub treasury_a: Pubkey,
    pub treasury_b: Pubkey,
}

//CONT:: merge function
//TODO:: perform a merge // parameterize exchange rate // insert burn addresses and affect token tx
//Upwork logo design - reserve fusogen.io
