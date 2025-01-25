module.exports = [
	{
	  "inputs": [],
	  "stateMutability": "nonpayable",
	  "type": "constructor"
	},
	{
	  "inputs": [],
	  "name": "checkFarm",
	  "outputs": [
		{
		  "internalType": "bool",
		  "name": "",
		  "type": "bool"
		}
	  ],
	  "stateMutability": "view",
	  "type": "function"
	},
	{
	  "inputs": [],
	  "name": "compound",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [],
	  "name": "rebalance",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "newBot",
		  "type": "address"
		}
	  ],
	  "name": "setBOTAddress",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "bool",
		  "name": "setUSDTonly",
		  "type": "bool"
		}
	  ],
	  "name": "setUSDTbool",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	},
	{
	  "inputs": [
		{
		  "internalType": "address",
		  "name": "Token",
		  "type": "address"
		}
	  ],
	  "name": "transferToAdmin",
	  "outputs": [],
	  "stateMutability": "payable",
	  "type": "function"
	}
  ];
  