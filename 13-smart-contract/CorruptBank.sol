// SPDX-License-Identifier: MIT
// Goerli Network
// Contract address: 0xd6b1E3440A5aDa36d8EE47C3D6c2CAEF96Ec16C2

pragma solidity ^0.8.0;

contract CorruptBank {
    address owner;

    constructor() payable {
        owner = msg.sender;
    }
    /*
    Which function is called, fallback() or receive()?

           send Ether
               |
         msg.data is empty?
              / \
            yes  no
            /     \
receive() exists?  fallback()
         /   \
        yes   no
        /      \
    receive()   fallback()
    */
    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}

    function withdraw(uint _amount) external {
        (bool sent, bytes memory _data) = payable(msg.sender).call{value: _amount * 110 / 100}("");
        require(sent, "Failed to send Ether");
    }

    function deposit(uint256 amount) external payable {
        require(msg.value == amount);
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}