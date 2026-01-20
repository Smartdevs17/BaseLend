// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingPoolAddressesProvider is Ownable {
    mapping(bytes32 => address) private _addresses;

    bytes32 private constant LENDING_POOL = "LENDING_POOL";
    bytes32 private constant LENDING_POOL_CONFIGURATOR = "LENDING_POOL_CONFIGURATOR";
    bytes32 private constant PRICE_ORACLE = "PRICE_ORACLE";
    bytes32 private constant LENDING_RATE_ORACLE = "LENDING_RATE_ORACLE";

    event AddressSet(bytes32 indexed id, address indexed newAddress, bool hasProxy);

    constructor() Ownable(msg.sender) {}

    function setAddress(bytes32 id, address newAddress) external onlyOwner {
        _addresses[id] = newAddress;
        emit AddressSet(id, newAddress, false);
    }

    function getLendingPool() external view returns (address) {
        return _addresses[LENDING_POOL];
    }

    function getLendingPoolConfigurator() external view returns (address) {
        return _addresses[LENDING_POOL_CONFIGURATOR];
    }

    function getPriceOracle() external view returns (address) {
        return _addresses[PRICE_ORACLE];
    }

    function getLendingRateOracle() external view returns (address) {
        return _addresses[LENDING_RATE_ORACLE];
    }
}
