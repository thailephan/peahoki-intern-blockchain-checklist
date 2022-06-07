// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LolMinter is ERC1155, Ownable {
    uint256 public constant XAYAH_CHAMPION = 0;
    uint256 public constant TEEMO_CHAMPION = 1;
    uint256 public constant CONTROL_WARD_CONSUMABLE = 2;
    uint256 public constant POTION_CONSUMABLE = 3;

    constructor() ERC1155("https://erc-metadata-return.herokuapp.com/lol/") {
        uint256[] memory tokens = new uint256[](4);
        tokens[0] = XAYAH_CHAMPION;
        tokens[1] = TEEMO_CHAMPION;
        tokens[2] = CONTROL_WARD_CONSUMABLE;
        tokens[3] = POTION_CONSUMABLE;

        uint256[] memory mintAmounts = new uint256[](4);
        mintAmounts[0] = 1;
        mintAmounts[1] = 1;
        mintAmounts[2] = 100;
        mintAmounts[3] = 50;

        _mintBatch(msg.sender, tokens, mintAmounts, "");
    }

    function mint(
        address to,
        uint256 id,
        uint256 amount
    ) external onlyOwner {
        _mint(to, id, amount, "");
    }

    /////
    // Metadata methods
    /////

    function name() external pure returns (string memory) {
        return "Lol Collection - 7:00 A.M";
    }

    function symbol() external pure returns (string memory) {
        return "TLC";
    }

    function uri(uint256 id) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(id), Strings.toString(id)));
    }
}