// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract Hello {
    address owner;

    string currentName;
    string constant HELLO = "Hello, ";

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Error: Not enough permisison to setName");
        _;
    }
    function setName(string calldata _name) external onlyOwner{
        currentName = _name;
    }

    function getName() external view returns (string memory){
        return currentName;
    }

    function hello() external view returns (string memory) {
        return string.concat(HELLO, currentName);
    }
}

// Copy and paste to remix.ethereum.org in order to compile
// and publish to rinkeby network to test easier

// Goerli Testnet
// Contract address: 0x750864691A15d43f6E323Ced1b9811E40C11032C