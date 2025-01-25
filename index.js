const { Web3 } = require('web3');
const config = require('./config');
const BOTControllerABI = require('./Abi');

const web3 = new Web3(`https://mantle-mainnet.infura.io/v3/${config.infuraProjectId}`);

const _from = "0xDf4023c082F6E1562fb228D7b961D97aF8708d4c";
const privateKey = `${config.privateKey}`;

// Define the bot addresses
const BOTAddress1 = "0x936f9e5454C0D95fD6AF0A61C33c70DB36bc78b3";
// Create an array of bot addresses
const BOTAddress = [BOTAddress1];

let isRunning = false;  // Flag to track if the function is currently running
const delay = ms => new Promise(res => setTimeout(res, ms));

// Function to check farm status and rebalance if necessary
async function checkFarmStatus() {
    if (isRunning) return;  // If the function is still running, skip execution

    isRunning = true;  // Set the flag to indicate the function is running

    for (let i = 0; i < BOTAddress.length; i++) {
        console.log("Checking Farm " + i);

        // Initialize the contract instance for each bot address
        let BOT = new web3.eth.Contract(BOTControllerABI, BOTAddress[i]);

        try {
            // Call the checkFarm method to get the farm status
            let inRange = await BOT.methods.checkFarm().call();
            console.log(`Farm ${i} in range status: `, inRange);

            // If the farm is not in range, we proceed with the rebalance transaction
            if (inRange == false) {
                const tx = {
                    from: _from,
                    to: BOTAddress[i],
                    gas: '5000000000',  // Use the estimated gas here
                    data: BOT.methods.rebalance().encodeABI(),
                    maxPriorityFeePerGas: '20000000',
                    maxFeePerGas: '20000000'
                };

                // Sign the transaction
                const signature = await web3.eth.accounts.signTransaction(tx, privateKey);
                console.log('Transaction signed:', signature);

                // Send the signed transaction
                const receipt = await web3.eth.sendSignedTransaction(signature.rawTransaction);
                console.log('Rebalance transaction successful. Receipt:', receipt);

                // Delay for 15 seconds before proceeding to the next farm
                isRunning = false;
            }
        }catch (error) {
            console.error('Error occurred during transaction:', error.message);
            if (error.message.includes('execution reverted')) {
                console.error('Transaction reverted. It could be due to contract logic or state conditions.');
            }
            isRunning = false;
        }
        isRunning = false;
    }};

checkFarmStatus();


// Set an interval to call checkFarmStatus every X milliseconds (e.g., 30 seconds)
setInterval(() => {
    checkFarmStatus();
}, 2000);

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