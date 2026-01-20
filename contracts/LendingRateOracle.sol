// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract LendingRateOracle is Ownable {
    mapping(address => uint256) private borrowRates;
    mapping(address => uint256) private liquidityRates;

    event BorrowRateUpdated(address indexed asset, uint256 newRate);
    event LiquidityRateUpdated(address indexed asset, uint256 newRate);

    constructor() Ownable(msg.sender) {}

    function setMarketBorrowRate(address asset, uint256 rate) external onlyOwner {
        borrowRates[asset] = rate;
        emit BorrowRateUpdated(asset, rate);
    }

    function setMarketLiquidityRate(address asset, uint256 rate) external onlyOwner {
        liquidityRates[asset] = rate;
        emit LiquidityRateUpdated(asset, rate);
    }

    function getMarketBorrowRate(address asset) external view returns (uint256) {
        return borrowRates[asset];
    }

    function getMarketLiquidityRate(address asset) external view returns (uint256) {
        return liquidityRates[asset];
    }
}
