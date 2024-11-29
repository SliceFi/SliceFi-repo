import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';

// Set the Solana connection
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Use your private key array here (replace with your actual secret key)
const wallet = Keypair.fromSecretKey(Uint8Array.from([
  175, 114, 228, 65, 103, 64, 46, 238, 14, 20, 227, 106, 22, 239, 15, 67, 
  212, 118, 101, 33, 152, 249, 69, 72, 100, 177, 166, 159, 15, 60, 25, 233, 
  221, 92, 142, 51, 148, 12, 49, 219, 178, 40, 126, 64, 1, 73, 88, 157, 223, 
  255, 36, 17, 197, 152, 178, 173, 155, 245, 34, 216, 226, 219, 200, 239
]));

// Token Mint Address
const mintAddress = '6m3G17izimj2VmNvnCZw2AEyYJtf7NL6kXQ7egUPY1Hg'; // Your token mint address

// Metadata update details
const updatedMetadata = {
  name: "SliceFi",
  symbol: "SlFi",
  uri: "https://brown-tired-gazelle-100.mypinata.cloud/ipfs/QmRcXLbjpGP55smJ48D6yDJR8K8LyYumEB5mCRyUuiVcno",
};

async function updateMetadata() {
  try {
    // Derive Metadata PDA
    const [metadataPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('metadata'),
        Metadata.PROGRAM_ID.toBuffer(),
        new PublicKey(mintAddress).toBuffer(),
      ],
      Metadata.PROGRAM_ID
    );

    // Create a transaction for metadata update
    const transaction = new Transaction().add(
      Metadata.updateMetadataAccountV2Instruction({
        metadata: metadataPDA,
        updateAuthority: wallet.publicKey,
        newUpdateAuthority: wallet.publicKey, // Optional: set a new update authority
        data: {
          name: updatedMetadata.name,
          symbol: updatedMetadata.symbol,
          uri: updatedMetadata.uri,
          sellerFeeBasisPoints: 0, // Optional: royalty (e.g., 500 = 5%)
          creators: null, // Optional: set creator info
        },
        isMutable: true, // Optional: set to false if metadata should be immutable
      })
    );

    // Sign and send the transaction
    const signature = await connection.sendTransaction(transaction, [wallet], {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
    });

    await connection.confirmTransaction(signature, 'confirmed');
    console.log('Metadata updated successfully with signature:', signature);
  } catch (error) {
    console.error('Error updating metadata:', error);
  }
}

// Run the function
updateMetadata();
