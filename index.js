const { Web3 } = require('web3');
const config = require('./config');
const BOTControllerABI = require('./Abi');

const web3 = new Web3(`https://optimism-mainnet.infura.io/v3/${config.infuraProjectId}`);

const _from = "0xDf4023c082F6E1562fb228D7b961D97aF8708d4c";
const privateKey = `${config.privateKey}`;

// Define the bot addresses (Controller - not actual SC)
const USDCVELO = "0x9b44dfc310ba41b2f4729343353cdc3695e1ffa8";


// Create an array of bot addresses
const BOTAddress = [USDCVELO];

let isRunning = false;  // Flag to track if the function is currently running
const delay = ms => new Promise(res => setTimeout(res, ms));

// Function to check farm status and rebalance if necessary
async function checkFarmStatus() {
    if (isRunning) return; // If the function is still running, skip execution

    isRunning = true; // Set the flag to indicate the function is running

    for (let i = 0; i < BOTAddress.length; i++) {
        console.log("Checking Farm " + i);

        // Initialize the contract instance for each bot address
        let BOT = new web3.eth.Contract(BOTControllerABI, BOTAddress[i]);

        try {
            // Call the checkFarm method to get the farm status
            let inRange = await BOT.methods.checkFarm().call();
            //let inRange = false; // Replace with actual call when ready
            console.log(`Farm ${i} in range status: `, inRange);

            if (inRange === false) {

                const txData = BOT.methods.UpdatePosition().encodeABI();


                const gas = await BOT.methods.UpdatePosition().estimateGas({
                    from: _from,
                });


                const gasWithBuffer = Math.floor(Number(gas) * 1.1); // Convert BigInt to number


                const maxPriorityFeePerGas = 200000000; 
                const maxFeePerGas = 200000000; 

                const tx = {
                    from: _from,
                    to: BOTAddress[i],
                    gas: gasWithBuffer, 
                    data: txData,
                    maxPriorityFeePerGas: maxPriorityFeePerGas, 
                    maxFeePerGas: maxFeePerGas 
                };

                // Sign the transaction
                const signature = await web3.eth.accounts.signTransaction(tx, privateKey);
                console.log('Transaction signed:', signature);

                // Send the signed transaction
                const receipt = await web3.eth.sendSignedTransaction(signature.rawTransaction);
                console.log('Rebalance transaction successful. Receipt:', receipt);
            }
        } catch (error) {
            console.error('Error occurred during transaction:', error.message);
            if (error.message.includes('execution reverted')) {
                console.error('Transaction reverted. It could be due to contract logic or state conditions.');
            }
        }
    }
    isRunning = false;
}

checkFarmStatus();


// Set an interval to call checkFarmStatus every X milliseconds (e.g., 30 seconds)
setInterval(() => {
    checkFarmStatus();
}, 5000);

const express = require('express');
const app = express();
const port = 8080; // Change to your preferred port

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Your existing routes and logic
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
