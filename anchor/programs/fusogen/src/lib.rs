use anchor_lang::prelude::*;

declare_id!("8u5DoSAV7cZxQAPYumVRZCJeYoijkkjCHsGgC6gKyp4m");

#[program]
pub mod fusogen {
    use super::*;

    pub fn greet(_ctx: Context<Initialize>) -> Result<()> {
        msg!("GM!");
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
