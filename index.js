const express = require('express');
const path = require('path');
const { Connection, PublicKey } = require('@solana/web3.js'); // Solana Web3.js library
const app = express();

// Solana Connection setup
const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

// Token Mint Address
const tokenMintAddress = new PublicKey('6m3G17izimj2VmNvnCZw2AEyYJtf7NL6kXQ7egUPY1Hg');

// Function to get the token supply
async function getTokenSupply() {
  try {
    const supply = await connection.getTokenSupply(tokenMintAddress);
    return supply.value.uiAmount; // Returns supply in human-readable format
  } catch (error) {
    console.error('Error fetching token supply:', error);
    throw new Error('Unable to fetch token supply');
  }
}

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve a custom homepage
app.get('/', (req, res) => {
  res.send(`
    <h1>Welcome to SliceFi 🍕</h1>
    <p>
      SliceFi is a meme coin project celebrating pizza culture and its authenticity! 
      Join us in preserving the art of pizza-making while supporting a sustainable future.
    </p>
    
    <h2>Token Overview</h2>
    <ul>
      <li><strong>Token Name:</strong> SliceFi</li>
      <li><strong>Symbol:</strong> SlFi</li>
      <li><strong>Mint Address:</strong> 6m3G17izimj2VmNvnCZw2AEyYJtf7NL6kXQ7egUPY1Hg</li>
      <li><strong>Mission:</strong> Establish a sustainable pizza school for future generations</li>
    </ul>
    
    <h2>Support the Project</h2>
    <p>
      Contribute to SliceFi by donating to our Solana wallet:
      <strong>JB7HkF2nBCgkUjLEu3F1nw82s5q1Pz2Uy7ciZQSPjsLe</strong>
    </p>
    
    <h3>Contact</h3>
    <ul>
      <li>Email: <a href="mailto:marcalexandru04@gmail.com">marcalexandru04@gmail.com</a></li>
      <li>LinkedIn: <a href="https://www.linkedin.com/in/alexandrumarc" target="_blank">Alexandru Marc</a></li>
    </ul>
    
    <p>Let's preserve pizza culture, one slice at a time! 🍕</p>
  `);
});

// Dynamic route for token info
app.get('/token-info', async (req, res) => {
  try {
    const supply = await getTokenSupply();
    res.send(`
      <h2>SliceFi Token Info</h2>
      <ul>
        <li><strong>Token Name:</strong> SliceFi</li>
        <li><strong>Symbol:</strong> SlFi</li>
        <li><strong>Mint Address:</strong> 6m3G17izimj2VmNvnCZw2AEyYJtf7NL6kXQ7egUPY1Hg</li>
        <li><strong>Current Supply:</strong> ${supply} tokens</li>
      </ul>
    `);
  } catch (error) {
    res.status(500).send('<h2>Error fetching token supply. Please try again later.</h2>');
  }
});

// Handle errors gracefully
app.use((err, req, res, next) => {
  console.error('An unexpected error occurred:', err);
  res.status(500).send('<h2>An unexpected error occurred. Please try again later.</h2>');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
