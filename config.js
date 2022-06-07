require("dotenv").config();

const senderAddress = process.env.SENDER_ADDRESS;
const senderPrivatekey = process.env.SENDER_PRIVATE_KEY;
const receiveAddress = process.env.RECEIVER_ADDRESS;

module.exports = {
    senderAddress,
    senderPrivatekey,
    receiveAddress,
}