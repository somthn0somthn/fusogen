use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount, Transfer};

declare_id!("8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m");

#[program]
pub mod fusogen {
    use super::*;

    pub fn initialize_mint(ctx: Context<InitializeMint>) -> Result<()> {
        let merge_account = &mut ctx.accounts.merge_account;
        let exchange_ratio: u64 = 100;
        merge_account.exchange_ratio = exchange_ratio;
        merge_account.mint = ctx.accounts.mint.key();
        merge_account.treasury_a = ctx.accounts.treasury_a.key();  //ATA
        merge_account.treasury_b = ctx.accounts.treasury_b.key();  //ATA

        Ok(())
    }

    pub fn burn_dao_treasury(ctx: Context<BurnTreasury>) -> Result<()> {
        let treasury_balance = ctx.accounts.treasury.amount;

        let cpi_accounts = Burn {
            mint: ctx.accounts.mint_treasury.to_account_info(),
            from: ctx.accounts.treasury.to_account_info(),
            authority: ctx.accounts.treasury_authority.to_account_info(),
        };
        let cpi_program = ctx.accounts.token_program.to_account_info();
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        token::burn(cpi_ctx, treasury_balance)?;
        Ok(())
    }

    //CONT :: add the new mint functionality and then the test and that should
    // good to move onto the FE
    pub fn merge_dao_treasury(ctx: Context<MergeTreasuries>) -> Result<()> {
        let treasury_a_balance = ctx.accounts.treasury_a_ata.amount;
        let treasury_b_balance = ctx.accounts.treasury_b_ata.amount;

        let cpi_a_accounts = Burn {
            mint: ctx.accounts.mint_treasury_a.to_account_info(),
            from: ctx.accounts.treasury_a_ata.to_account_info(),
            authority: ctx.accounts.treasury_a_authority.to_account_info(),
        };
        let cpi_a_program = ctx.accounts.token_program.to_account_info();
        let cpi_a_ctx = CpiContext::new(cpi_a_program, cpi_a_accounts);

        token::burn(cpi_a_ctx, treasury_a_balance)?;


        let cpi_b_accounts = Burn {
            mint: ctx.accounts.mint_treasury_b.to_account_info(),
            from: ctx.accounts.treasury_b_ata.to_account_info(),
            authority: ctx.accounts.treasury_b_authority.to_account_info(),
        };
        let cpi_b_program = ctx.accounts.token_program.to_account_info();
        let cpi_b_ctx = CpiContext::new(cpi_b_program, cpi_b_accounts);

        token::burn(cpi_b_ctx, treasury_b_balance)?;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct MergeTreasuries<'info> {
    #[account(mut)]
    pub merge_account: Account<'info, MergeAccount>,
    #[account(mut)]
    pub mint_treasury_a: Account<'info, Mint>, // The mint for the token being burned
    #[account(mut)]
    pub treasury_a_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint_treasury_b: Account<'info, Mint>, // The mint for the token being burned
    #[account(mut)]
    pub treasury_b_ata: Account<'info, TokenAccount>,
    #[account(signer)] // Signer: Ensure the treasury authority is signing the transaction
    pub treasury_a_authority: Signer<'info>, // The authority allowed to burn tokens
    #[account(signer)] // Signer: Ensure the treasury authority is signing the transaction
    pub treasury_b_authority: Signer<'info>, // The authority allowed to burn tokens
    pub token_program: Program<'info, Token>, 
}

#[derive(Accounts)]
pub struct BurnTreasury<'info> {
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>, // ATA holding tokens to burn
    #[account(mut)]
    pub mint_treasury: Account<'info, Mint>, // The mint for the token being burned
    #[account(signer)] // Signer: Ensure the treasury authority is signing the transaction
    pub treasury_authority: Signer<'info>, // The authority allowed to burn tokens
    pub token_program: Program<'info, Token>, 
}


#[derive(Accounts)]
pub struct InitializeMint<'info> {
    #[account(init, payer = user, space = 8 + 8 + 32 + 32 + 32)]
    pub merge_account: Account<'info, MergeAccount>,
    #[account(mut)]
    pub mint: Account<'info, Mint>, // Mint for the new token
    #[account(mut)]
    pub treasury_a: Account<'info, TokenAccount>, //ATA
    #[account(mut)]
    pub treasury_b: Account<'info, TokenAccount>, //ATA
    #[account(mut)]
    pub user: Signer<'info>,

    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Program<'info, Token>,
}

#[account]
pub struct MergeAccount {
    pub exchange_ratio: u64,
    pub mint: Pubkey,
    pub treasury_a: Pubkey,
    pub treasury_b: Pubkey,
}

//CONT:: cleanup test code, merge function
//TODO:: perform a merge // parameterize exchange rate // insert burn addresses and affect token tx
//Upwork logo design - reserve fusogen.io
