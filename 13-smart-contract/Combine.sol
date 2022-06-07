// SPDX-License-Identifier: MIT
// Goerli Network
// Contract address: 0xa04bc4c47a0964e634ef4bf98961851e66b64a8b

pragma solidity ^0.8.0;

import "./CorruptBank.sol";
import "./HelloWorld.sol";

contract Combine is CorruptBank, HelloWorld {
    constructor() payable{
    }
}