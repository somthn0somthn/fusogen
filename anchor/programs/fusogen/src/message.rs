use anchor_lang::{AnchorDeserialize, AnchorSerialize};
use std::io;

const PAYLOAD_ID_MERGE_TERMS: u8 = 1;

#[derive(Clone)]
pub enum FusogenMessage {
    MergeTerms {
        proposing_dao: [u8; 32],
        proposed_ratio: u64,
        expiry: i64,
    }
}

impl AnchorSerialize for FusogenMessage {
    fn serialize<W: io::Write>(&self, writer: &mut W) -> io::Result<()> {
        match self {
            FusogenMessage::MergeTerms { 
                proposing_dao, 
                proposed_ratio, 
                expiry 
            } => {
                PAYLOAD_ID_MERGE_TERMS.serialize(writer)?;
                proposing_dao.serialize(writer)?;
                proposed_ratio.serialize(writer)?;
                expiry.serialize(writer)
            }
        }
    }
}

impl AnchorDeserialize for FusogenMessage {
    fn deserialize_reader<R: io::Read>(reader: &mut R) -> io::Result<Self> {
        let payload_id = u8::deserialize_reader(reader)?;
        match payload_id {
            PAYLOAD_ID_MERGE_TERMS => Ok(FusogenMessage::MergeTerms {
                proposing_dao: <[u8; 32]>::deserialize_reader(reader)?,
                proposed_ratio: u64::deserialize_reader(reader)?,
                expiry: i64::deserialize_reader(reader)?,
            }),
            _ => Err(io::Error::new(
                io::ErrorKind::InvalidInput,
                "invalid payload ID",
            )),
        }
    }
}