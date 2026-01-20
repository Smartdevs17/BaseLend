// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title InterestRateModel
 * @dev Calculate interest rates based on utilization
 */
contract InterestRateModel is Ownable {
    
    uint256 public baseRate = 200; // 2% in basis points
    uint256 public multiplier = 1000; // 10% in basis points
    uint256 public jumpMultiplier = 5000; // 50% in basis points
    uint256 public kink = 8000; // 80% utilization in basis points
    
    event RatesUpdated(uint256 baseRate, uint256 multiplier, uint256 jumpMultiplier, uint256 kink);
    
    constructor() Ownable(msg.sender) {}
    
    function getBorrowRate(uint256 _utilization) public view returns (uint256) {
        if (_utilization <= kink) {
            return baseRate + (_utilization * multiplier) / 10000;
        } else {
            uint256 normalRate = baseRate + (kink * multiplier) / 10000;
            uint256 excessUtil = _utilization - kink;
            return normalRate + (excessUtil * jumpMultiplier) / 10000;
        }
    }
    
    function getSupplyRate(uint256 _utilization, uint256 _reserveFactor) public view returns (uint256) {
        uint256 borrowRate = getBorrowRate(_utilization);
        uint256 rateToPool = (borrowRate * (10000 - _reserveFactor)) / 10000;
        return (_utilization * rateToPool) / 10000;
    }
    
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
