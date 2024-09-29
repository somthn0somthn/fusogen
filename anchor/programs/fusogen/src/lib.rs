use anchor_lang::prelude::*;
use anchor_spl::token::{self, Burn, Mint, MintTo, Token, TokenAccount, Transfer};
use anchor_spl::associated_token::AssociatedToken;

declare_id!("8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m");

#[program]
pub mod fusogen {
    use super::*;   

    pub fn greet(ctx: Context<Greet>) -> Result<()> {
        // For frontend testing purposes
        msg!("Greetings from: {:?}", ctx.program_id);
        msg!("THIS is wallet1 {:?}", ctx.accounts.user1.key());
        msg!("THIS is wallet2 {:?}", ctx.accounts.user2.key());
        
        let mint_address = ctx.accounts.mint.key();
        msg!("Mint address is {}", mint_address);
    
        let ata_balance = ctx.accounts.ata.amount;
        msg!("ATA balance is {}", ata_balance);
    
        Ok(())
    }

   
    //TODO parameterize the token payout ammounts
    pub fn merge_dao_treasuries(ctx: Context<MergeTreasuries>) -> Result<()> {
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

        //creating new tokens - not creating new ATAs now - not relying on MergeAccount

        let mint_a_accounts = MintTo {
            mint: ctx.accounts.new_mint.to_account_info(),
            to: ctx.accounts.new_treasury_a_ata.to_account_info(),
            authority: ctx.accounts.treasury_a_authority.to_account_info(),
        };
        let mint_a_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), mint_a_accounts);
        let new_tokens_a = 123;
        token::mint_to(mint_a_ctx, new_tokens_a)?;

        let mint_b_accounts = MintTo {
            mint: ctx.accounts.new_mint.to_account_info(),
            to: ctx.accounts.new_treasury_b_ata.to_account_info(),
            authority: ctx.accounts.treasury_a_authority.to_account_info(),
        };
        let mint_b_ctx = CpiContext::new(ctx.accounts.token_program.to_account_info(), mint_b_accounts);
        let new_tokens_b = 456;
        token::mint_to(mint_b_ctx, new_tokens_b)?;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct MergeTreasuries<'info> {
    //old accounts
    #[account(mut)]
    pub mint_treasury_a: Account<'info, Mint>, // The mint for the token being burned
    #[account(mut)]
    pub treasury_a_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub mint_treasury_b: Account<'info, Mint>, // The mint for the token being burned
    #[account(mut)]
    pub treasury_b_ata: Account<'info, TokenAccount>,

     
    //new accnounts
    #[account(mut, constraint = new_mint.mint_authority == Some(treasury_a_authority.key()).into())]
    pub new_mint: Account<'info, Mint>,
    #[account(mut)]
    pub new_treasury_a_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub new_treasury_b_ata: Account<'info, TokenAccount>,

    //signers
    #[account(signer)] // Signer: Ensure the treasury authority is signing the transaction
    pub treasury_a_authority: Signer<'info>, // The authority allowed to burn tokens
    #[account(signer)] // Signer: Ensure the treasury authority is signing the transaction
    pub treasury_b_authority: Signer<'info>, // The authority allowed to burn tokens
    
    pub token_program: Program<'info, Token>, 
    pub system_program: Program<'info, System>,
}

//remove this after testing 
#[derive(Accounts)]
pub struct Greet<'info> {
    pub mint: Account<'info, Mint>,
    #[account(
        constraint = ata.mint == mint.key()
    )]
    pub ata: Account<'info, TokenAccount>,
    #[account(signer)]
    pub user1: Signer<'info>,
    #[account(signer)]
    pub user2: Signer<'info>,
}
