import { Connection, Keypair, PublicKey, Transaction } from '@solana/web3.js';
import { programs } from '@metaplex/js'; 
const { Metadata } = programs.metadata;

// Solana connection
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Replace with your secret key array
const wallet = Keypair.fromSecretKey(Uint8Array.from([175,114,228,65,103,64,46,238,14,20,227,106,22,239,15,67,212,118,101,33,152,249,69,72,100,177,166,159,15,60,25,233,221,92,142,51,148,12,49,219,178,40,126,64,1,73,88,157,223,255,36,17,197,152,178,173,155,245,34,216,226,219,200,239]));

// Token mint address for SliceFi
const tokenMintAddress = new PublicKey('43kpszYidSEsSDhmHUB5R9YpBdvxifWoK4MhmVfwqYWK');

// Metadata information for SliceFi
const metadataData = {
  name: "SliceFi", // Token name
  symbol: "SlFi",  // Token symbol
  uri: "https://example.com/metadata.json",
};

// Generate the PDA (Program Derived Address) for the token metadata
const metadataPDA = await Metadata.getPDA(tokenMintAddress);

try {
  // Create the transaction for the metadata account
  const transaction = new Transaction().add(
    Metadata.create(
      {
        metadata: metadataPDA,
        metadataData: {
          ...metadataData,
          creators: null, // You can add a list of creators if applicable
          sellerFeeBasisPoints: 0, // Define the royalty percentage (0 = no royalties)
        },
        mint: tokenMintAddress,
        mintAuthority: wallet.publicKey,
        updateAuthority: wallet.publicKey,
        payer: wallet.publicKey,
      },
      { connection }
    )
  );

  // Sign and send the transaction
  const signature = await connection.sendTransaction(transaction, [wallet], {
    skipPreflight: false,
    preflightCommitment: 'confirmed',
  });

  // Confirm the transaction
  await connection.confirmTransaction(signature, 'confirmed');
  console.log('Metadata account created with signature:', signature);
} catch (error) {
  console.error('Error creating metadata account:', error);
}
