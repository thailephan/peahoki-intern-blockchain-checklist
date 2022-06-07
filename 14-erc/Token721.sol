    // SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PokemonMinter is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    constructor() ERC721("PokemonMinter", "PKMN") {}

    function mintPokemon(address summoner)
        public
        returns (uint256)
    {
        uint256 newItemId = _tokenIds.current();
        _mint(summoner, newItemId);

        _tokenIds.increment();
        return newItemId;
    }

    function _baseURI() internal pure override returns (string memory) {
        return "https://erc-metadata-return.herokuapp.com/pokemons/";
    }
}
// Rinkeby Address: 0x79111a8085f830b94FF3256536AC1f0a968d2f8D