//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract BookBorrow is Ownable, ERC1155 {
    using Strings for uint256;

    error BorrowingBook();

    mapping(address => uint256) public addrToBook;

    event BorrowingEvent(address borrower, uint256 bookId, uint256 borrowedAt);
    event ReturnBackEvent(address returner, uint256 bookId, uint256 returnAt);

    uint256 public constant BOOK1 = 1;
    uint256 public constant BOOK2 = 2;
    uint256 public constant BOOK3 = 3;
    uint256 public constant BOOK4 = 4;
    uint256 public constant BOOK5 = 5;

    function name() external pure returns (string memory) {
        return "Borrowing books";
    }

    constructor() ERC1155("http://localhost:5000/books/") {
        _mint(msg.sender, BOOK1, 2, "");
        _mint(msg.sender, BOOK2, 10, "");
        // _mint(msg.sender, BOOK3, 0, "");
        _mint(msg.sender, BOOK4, 7, "");
        _mint(msg.sender, BOOK5, 10, "");
    }

    function borrowBook(address _to, uint256 _id) external onlyOwner {
        uint256 size;
        assembly {
            size := extcodesize(_to)
        }

        if(addrToBook[_to] > 0) {
            revert BorrowingBook();
        }

        require(size == 0, "BookBorrowing: Not allow contract account to borrow book");
        require(balanceOf(owner(), _id) > 0, "BookBorrowing: No book left to borrow");

        addrToBook[_to] = _id;
        safeTransferFrom(owner(), _to, _id, 1, "");

        emit BorrowingEvent(_to, _id, block.timestamp);
    }

    function returnBookBack() external {
        address _from = msg.sender;

        require(addrToBook[_from] > 0, "BookBorrowing: Not borrow any to return");

        safeTransferFrom(_from, owner(), addrToBook[_from], 1, "");
        delete addrToBook[_from];

        emit ReturnBackEvent(_from, addrToBook[_from], block.timestamp);
    }

   function getUri(uint256 _id) public view returns (string memory) {
        return string(abi.encodePacked(uri(_id), _id.toString()));
   }

}
