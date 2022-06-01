require("dotenv").config();

const Web3 = require("web3");
const ALCHEMY_RINKEBY = process.env.API_KEY;

const web3 = new Web3(Web3.givenProvider || ALCHEMY_RINKEBY);

const senderAddress = process.env.SENDER_ADDRESS;
const senderPrivatekey = process.env.SENDER_PRIVATE_KEY
const receiveAddress = process.env.RECEIVER_ADDRESS;

const TRANSACTION_GAS_LIMIT = 21000;
const ETHER_SEND = web3.utils.toWei(".1", "ether");

const transfer = async function () {
    // Ký một giao dịch trước khi gửi nó vào mạng
    const signedTransaction = await web3.eth.accounts.signTransaction({
        to: receiveAddress,
        gas: TRANSACTION_GAS_LIMIT,
        value: ETHER_SEND
    }, senderPrivatekey);

    // In ra thông tin liên quan đến giao dịch đã ký như r, s, v, rawTransaction, transactionHash
    console.log(signedTransaction);

    // Gửi giao dịch đã ký vào mạng và chờ xác thực
    // Flow event sending => send => receipt, then(recepit) => confirmation
    web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .once('sending', function(payload){ console.log("Sending: ", payload) })
    .once('sent', function(payload){ console.log("Sent: ", payload) })
    .once('receipt', function(receipt){ console.log("Receipt: ", receipt) })
    .on('confirmation', function(confNumber, receipt, latestBlockHash){ 
        console.log("Confirmation: ", confNumber, receipt, latestBlockHash)
    })
    .on('error', function(error){ console.log("Error:", error) })
}

transfer();
