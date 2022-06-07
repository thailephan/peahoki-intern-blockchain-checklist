const Web3 = require("web3");

const ALCHEMY_RINKEBY = process.env.RINKEBY_API_KEY;
const ALCHEMY_GOERLI = process.env.GOERLI_API_KEY;
module.exports = {
    rinkeby: new Web3(Web3.givenProvider || ALCHEMY_RINKEBY),
    goerli: new Web3(Web3.givenProvider || ALCHEMY_GOERLI),
};