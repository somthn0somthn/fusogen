use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, TokenAccount, Transfer, Token, MintTo};

declare_id!("8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m");

#[program]
pub mod fusogen {
    use super::*;

    pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
        let mint_account = &mut ctx.accounts.mint_account;        
        let exchange_ratio: u64 = 100;
        mint_account.exchange_ratio = exchange_ratio;
        mint_account.mint = ctx.accounts.mint.key();

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32)]
    pub mint_account: Account<'info, MintAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
/*     #[account(init, payer = user, token::mint = mint, token::authority = user)]
    pub vault_a: Account<'info, TokenAccount>,
    #[account(init, payer = user, token::mint = mint, token::authority = user)]
    pub vault_b: Account<'info, TokenAccount>, */
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
/*     pub vault_a: Pubkey,
    pub vault_b: Pubkey, */
}


//CONT:: Commit this, make a new branch and Continue thinking about how vault_a and vault_b fit into this code