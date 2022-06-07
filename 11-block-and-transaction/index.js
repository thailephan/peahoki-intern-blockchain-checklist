require("dotenv").config({
    path: "../.env",
});

// index.ts
const web3 = require("../web3").goerli;
const abi = require("./hello.abi.json");
const {receiveAddress, senderPrivatekey, senderAddress} = require("../config");

const BLOCK_NUMBER = "0x80ed090a39e4ee5924251e5c461ad9691b002c8bb7b189912241b60585fdd65e";

const TRANSACTION_GAS_LIMIT = 50000;
const HELLO_CONTRACT_ADDRESS = "0x750864691A15d43f6E323Ced1b9811E40C11032C";
const HelloContract = new web3.eth.Contract(abi, HELLO_CONTRACT_ADDRESS);

showBlockByHash();

showTransactionInBlock();

// greet();

async function showBlockByHash() {
    // Get specified block
    const block = await web3.eth.getBlock(BLOCK_NUMBER);
    console.log("====================================")
    console.log("Block")
    console.log("====================================")
    console.log(block);
    console.log("====================================")
}

async function showTransactionInBlock() {
    const TRANSACTION_INDEX = 0;
    const transaction = await web3.eth.getTransactionFromBlock(BLOCK_NUMBER, TRANSACTION_INDEX);
    console.log("====================================")
    console.log("Transaction hash")
    console.log("====================================")
    console.log(transaction.hash);
    console.log("====================================")
    console.log("")
    console.log("====================================")
    console.log(`Transaction ${TRANSACTION_INDEX} in block`)
    console.log("====================================")
    console.log(transaction);
    console.log("====================================")
}

async function greet() {
    let greeting = await HelloContract.methods.hello().call();
    console.log("Greeting 1: ", greeting);

    await setNewGreetingName("ngoc-ngoc");
}

async function setNewGreetingName(name) {
    const query = HelloContract.methods.setName(name);
    const encodedABI = query.encodeABI();

    // Sign transaction when use alchemy
    const signedTransaction = await web3.eth.accounts.signTransaction({
        to: HELLO_CONTRACT_ADDRESS,
        gas: TRANSACTION_GAS_LIMIT,
        data:encodedABI,
    }, senderPrivatekey);

    // Just can be use when node provider have your key
    // Way 1
    // await HelloContract.methods.setName(name).send();
    // Way 2
    web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .once('sending', function(payload){ console.log("Sending: ", payload) })
    .once('sent', function(payload){ console.log("Sent: ", payload) })
    .once('receipt', function(receipt){ console.log("Receipt: ", receipt) })
    .on('confirmation', function(confNumber, receipt, latestBlockHash){ 
        console.log("Confirmation: ", confNumber, receipt, latestBlockHash)
        console.log("====================================")
        
        // Call to test first data receive
        HelloContract.methods.hello().call().then(console.log);
    })
    .on('error', function(error){ console.log("Error:", error) });
}
