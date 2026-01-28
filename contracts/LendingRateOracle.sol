// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LendingRateOracle
 * @notice Manages asset-specific borrow and liquidity rates for the protocol
 * @dev Simple registry controlled by the protocol owner
 */
contract LendingRateOracle is Ownable {
    /// @notice Maps asset address to its current borrow rate in basis points (100 = 1%)
    mapping(address => uint256) private borrowRates;
    
    /// @notice Maps asset address to its current liquidity (supply) rate in basis points
    mapping(address => uint256) private liquidityRates;

    /**
     * @notice Emitted when the borrow rate for an asset is updated
     * @param asset The address of the underlying asset
     * @param newRate The new borrow rate in basis points
     */
    event BorrowRateUpdated(address indexed asset, uint256 newRate);
    
    /**
     * @notice Emitted when the liquidity rate for an asset is updated
     * @param asset The address of the underlying asset
     * @param newRate The new liquidity rate in basis points
     */
    event LiquidityRateUpdated(address indexed asset, uint256 newRate);

    constructor() Ownable(msg.sender) {}

    /**
     * @notice Sets the borrow rate for a specific asset (Admin only)
     * @param asset The address of the token
     * @param rate The rate in basis points
     */
    function setMarketBorrowRate(address asset, uint256 rate) external onlyOwner {
        borrowRates[asset] = rate;
        emit BorrowRateUpdated(asset, rate);
    }

    /**
     * @notice Sets the liquidity rate for a specific asset (Admin only)
     * @param asset The address of the token
     * @param rate The rate in basis points
     */
    function setMarketLiquidityRate(address asset, uint256 rate) external onlyOwner {
        liquidityRates[asset] = rate;
        emit LiquidityRateUpdated(asset, rate);
    }

    /**
     * @notice Fetches the current market borrow rate for an asset
     * @param asset The address of the token
     * @return The rate in basis points
     */
    function getMarketBorrowRate(address asset) external view returns (uint256) {
        return borrowRates[asset];
    }

    /**
     * @notice Fetches the current market liquidity rate for an asset
     * @param asset The address of the token
     * @return The rate in basis points
     */
    function getMarketLiquidityRate(address asset) external view returns (uint256) {
        return liquidityRates[asset];
    }
}
