require("dotenv").config();

const web3 = require("./web3").rinkeby;
const {receiveAddress, senderPrivatekey} = require("./config");

const TRANSACTION_GAS_LIMIT = 21000;
const ETHER_SEND = web3.utils.toWei(".1", "ether");
const GAS_PRICE = '0x09184e72a000';

const transfer = async function () {
    // Ký một giao dịch trước khi gửi nó vào mạng
    const signedTransaction = await web3.eth.accounts.signTransaction({
        to: receiveAddress,
        gas: TRANSACTION_GAS_LIMIT,
        value: ETHER_SEND,
        gasPrice: GAS_PRICE,
    }, senderPrivatekey);

    // In ra thông tin liên quan đến giao dịch đã ký như r, s, v, rawTransaction, transactionHash
    console.log("====================================")
    console.log("Transaction")
    console.log("====================================")
    console.log(signedTransaction);
    console.log("====================================")
    console.log("");

    // Gửi giao dịch đã ký vào mạng và chờ xác thực
    // Flow event sending => send => receipt, then(recepit) => confirmation

    console.log("====================================")
    console.log("Send Transaction")
    console.log("====================================")
    web3.eth
    .sendSignedTransaction(signedTransaction.rawTransaction)
    .once('sending', function(payload){ console.log("Sending: ", payload) })
    .once('sent', function(payload){ console.log("Sent: ", payload) })
    .once('receipt', function(receipt){ console.log("Receipt: ", receipt) })
    .on('confirmation', function(confNumber, receipt, latestBlockHash){ 
        console.log("Confirmation: ", confNumber, receipt, latestBlockHash)
        console.log("====================================")
    })
    .on('error', function(error){ console.log("Error:", error) })
}

transfer();
