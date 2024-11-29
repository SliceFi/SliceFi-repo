const { Connection, PublicKey } = require('@solana/web3.js');

// Solana network connection
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Your token's mint address
const mintAddress = new PublicKey('6m3G17izimj2VmNvnCZw2AEyYJtf7NL6kXQ7egUPY1Hg');

// Fetch token supply
async function getTokenSupply() {
    const supply = await connection.getTokenSupply(mintAddress);
    console.log("Token Supply: ", supply.value.amount);
}

getTokenSupply();
