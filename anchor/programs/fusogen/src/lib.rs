use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod error;
pub mod message;

use instructions::*;
use state::*;
use wormhole_anchor_sdk::wormhole;

declare_id!("J6Lyd68nbS4k4qKxgRmXShYm56hZqMVft83T5uuqdyAT");

#[program]
pub mod fusogen {
    use super::*;
    
    pub fn merge_dao_treasuries(ctx: Context<MergeTreasuries>) -> Result<()> {
        instructions::merge::merge_dao_treasuries(ctx)
    }

    pub fn receive_merge_terms(
        ctx: Context<ReceiveMergeTerms>,
        vaa_hash: [u8; 32]
    ) -> Result<()> {
        instructions::terms::receive_merge_terms(ctx, vaa_hash)
    }

    pub fn respond_to_terms(
        ctx: Context<RespondToTerms>,
        accept: bool
    ) -> Result<()> {
        instructions::terms::respond_to_terms(ctx, accept)
    }

}

#[cfg(test)]
mod test {
    use super::*;
    
    #[test]
    fn test_wormhole_integration() {
        // Test chain ID constant
        let chain_id = wormhole::CHAIN_ID_SOLANA;
        assert_eq!(chain_id, 1);
        
        // Test some Wormhole seed constants
        assert_eq!(wormhole::SEED_PREFIX_POSTED_VAA, b"PostedVAA");
        assert_eq!(wormhole::SEED_PREFIX_EMITTER, b"emitter");
        
        // Test that we can access Wormhole program ID
        let program_id = wormhole::program::ID;
        assert!(program_id.to_string().len() > 0);
    }
}