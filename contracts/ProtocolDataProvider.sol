// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./LendingPoolAddressesProvider.sol";

contract ProtocolDataProvider {
    LendingPoolAddressesProvider public addressesProvider;

    constructor(address _addressesProvider) {
        addressesProvider = LendingPoolAddressesProvider(_addressesProvider);
    }

    struct TokenData {
        string symbol;
        address tokenAddress;
    }

    function getAllReservesTokens() external view returns (TokenData[] memory) {
        // Mock implementation for MVP
        TokenData[] memory tokens = new TokenData[](1);
        tokens[0] = TokenData("ETH", address(0));
        return tokens;
    }
}
