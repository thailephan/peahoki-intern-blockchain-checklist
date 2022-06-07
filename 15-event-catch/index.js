require("dotenv").config({
    path: "../.env",
});

const web3 = require("../web3").rinkeby;
const {senderPrivatekey} = require("../config");
const abi = require("./SetName.abi.json");

const TRANSACTION_GAS_LIMIT = 50000;
const CONTRACT_ADDRESS = "0x39e6ddED6cEB6627120609e17129b9c52883a426";
const SetNameContract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);


let options = {
    filter: {
        // topics: [
        //     "0x6de6ea457fb1fa90dbd1b00042c8fa4d53ca0efed78c7da936a79a4ca5945db"
        // ]
    },
    fromBlock: "earliest",
    toBlock: "latest",
};

async function getName() {
    let name = await SetNameContract.methods.name().call();
    console.log("currentName 1: ", name);

    SetNameContract.getPastEvents('updateName', options)
        .then(result => {
            console.log("====================================")
            console.log("Get Past Events")
            console.log("====================================")

            console.log ('result', result[0].raw.topics);
            console.log("Results length: ", result.length);

            console.log("====================================")
            console.log("End get Past Events")
            console.log("====================================")
        })
        .catch(err => {
            console.log("====================================")
            console.log("Get Past Events")
            console.log("====================================")

            console.log ('error', err.message, err.stack)

            console.log("====================================")
            console.log("End get Past Events")
            console.log("====================================")
        });
    await setNewName("Paker Ui giồi ơi");
}

async function setNewName(name) {
    const query = SetNameContract.methods.setName(name);
    const encodedABI = query.encodeABI();

    // Sign transaction when use alchemy
    const signedTransaction = await web3.eth.accounts.signTransaction({
        to: CONTRACT_ADDRESS,
        gas: TRANSACTION_GAS_LIMIT,
        data: encodedABI,
    }, senderPrivatekey);

    SetNameContract.events.updateName(options)
    .on('data', event => {
        console.log("====================================")
        console.log("UpdateName: data")
        console.log("====================================")

        console.log(event)

        console.log("====================================")
        console.log("End UpdateName: data")
        console.log("====================================")
    })
    .on('changed', changed => {
        console.log("====================================")
        console.log("UpdateName: changed")
        console.log("====================================")

        console.log(changed)
        
        console.log("====================================")
        console.log("End UpdateName: changed")
        console.log("====================================")
    })
    .on('error', err => {
        console.log("====================================")
        console.log("UpdateName: error")
        console.log("====================================")

        console.log(err);

        console.log("====================================")
        console.log("End UpdateName: error")
        console.log("====================================")
        throw err;
    })
    .on('connected', str => {
        console.log("====================================")
        console.log("UpdateName: connected")
        console.log("====================================")

        console.log(str)

        console.log("====================================")
        console.log("End UpdateName: connected")
        console.log("====================================")
    })
    // Just can be use when node provider have your key
    // Way 1
    // await HelloContract.methods.setName(name).send();
    // Way 2
    let countConfirm = 0;
    web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .once('sending', function(payload){ 
        console.log("====================================")
        console.log("Transaction: sending: ", payload)
        console.log("====================================")
    })
    .once('sent', function(payload){
        console.log("====================================")
        console.log("Transaction: sent: ", payload)
        console.log("====================================")
    })
    .once('receipt', function(receipt){ 
        console.log("====================================")
        console.log("Transaction: receipt: ", receipt) 
        console.log("====================================")
        })
    .on('confirmation', function(confNumber, receipt, latestBlockHash){ 
        console.log("====================================")
        console.log("Transaction: confirmation: ", confNumber, receipt, latestBlockHash)
        console.log("====================================")
        console.log("Confirms:", ++countConfirm);
        // Call to test first data receive
        SetNameContract.methods.name().call().then(newName => console.log("newName 1: ", name));
    })
    .on('error', function(error){ console.log("Error:", error) });
}

getName();