// SPDX-License-Identifier: MIT
// Goerli network
// Contract account: 0x731eE816D4E646cC077f0394C3c16e6E63f69689

pragma solidity ^0.8.0;

contract HelloWorld {
    function helloWorld() external view returns(string memory, uint){
        return ("Hello world", block.timestamp);
    }
}