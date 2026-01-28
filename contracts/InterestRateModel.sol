// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InterestRateModel
 * @dev Calculate interest rates based on utilization
 */
contract InterestRateModel is Ownable {
    
    /// @notice The baseline interest rate at 0% utilization (in basis points, 100 = 1%)
    uint256 public baseRate = 200; // 2% in basis points
    
    /// @notice The rate of increase in interest per unit of utilization before the kink
    uint256 public multiplier = 1000; // 10% in basis points
    
    /// @notice The steepness of rate increase after passing the kink point
    uint256 public jumpMultiplier = 5000; // 50% in basis points
    
    /// @notice The utilization threshold (in basis points) where the jump multiplier activates
    uint256 public kink = 8000; // 80% utilization in basis points
    
    /**
     * @notice Emitted when the protocol parameters are modified
     * @param baseRate The new baseline rate
     * @param multiplier The new slope before kink
     * @param jumpMultiplier The new slope after kink
     * @param kink The new utilization threshold
     */
    event RatesUpdated(uint256 baseRate, uint256 multiplier, uint256 jumpMultiplier, uint256 kink);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Calculates the annualized borrow interest rate
     * @dev Uses a kinked interest rate model to discourage 100% utilization
     * @param _utilization The current pool utilization in basis points
     * @return The annual borrow rate in basis points
     */
    function getBorrowRate(uint256 _utilization) public view returns (uint256) {
        if (_utilization <= kink) {
            return baseRate + (_utilization * multiplier) / 10000;
        } else {
            uint256 normalRate = baseRate + (kink * multiplier) / 10000;
            uint256 excessUtil = _utilization - kink;
            return normalRate + (excessUtil * jumpMultiplier) / 10000;
        }
    }
    
    /**
     * @notice Calculates the annualized supply interest rate
     * @dev Reflects the borrow rate minus the protocol reserve factor, distributed over total supply
     * @param _utilization Current pool utilization in basis points
     * @param _reserveFactor Protocol fee percentage in basis points
     * @return The annual supply rate in basis points
     */
    function getSupplyRate(uint256 _utilization, uint256 _reserveFactor) public view returns (uint256) {
        uint256 borrowRate = getBorrowRate(_utilization);
        uint256 rateToPool = (borrowRate * (10000 - _reserveFactor)) / 10000;
        return (_utilization * rateToPool) / 10000;
    }
    
    /**
     * @notice Admin function to tune the interest rate curves
     * @param _baseRate Starting interest rate
     * @param _multiplier Slope before the jump
     * @param _jumpMultiplier Slope after the jump
     * @param _kink Pivot point for utilization
     */
    function updateRates(
        uint256 _baseRate,
        uint256 _multiplier,
        uint256 _jumpMultiplier,
        uint256 _kink
    ) external onlyOwner {
        require(_kink <= 10000, "Kink too high");
        
        baseRate = _baseRate;
        multiplier = _multiplier;
        jumpMultiplier = _jumpMultiplier;
        kink = _kink;
        
        emit RatesUpdated(_baseRate, _multiplier, _jumpMultiplier, _kink);
    }
}
