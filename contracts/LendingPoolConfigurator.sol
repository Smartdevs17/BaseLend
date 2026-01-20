// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./LendingPool.sol";
import "./InterestRateModel.sol";
import "./CollateralManager.sol";

/**
 * @title LendingPoolConfigurator
 * @dev Configuration manager for the LendingPool
 */
contract LendingPoolConfigurator is Ownable {
    
    LendingPool public lendingPool;
    
    event ReserveInitialized(address indexed asset, address interestRateModel);
    event ReserveParamsUpdated(address indexed asset, uint256 ltv, uint256 liquidationThreshold, uint256 liquidationBonus);
    event ReserveFrozen(address indexed asset);
    event ReserveUnfrozen(address indexed asset);
    
    constructor(address _lendingPool) Ownable(msg.sender) {
        lendingPool = LendingPool(_lendingPool);
    }
    
    function initReserve(
        address _asset,
        address _interestRateModel,
        address _collateralManager
    ) external onlyOwner {
        // In a real implementation, this would call initReserve on the pool
        // For atomic commit structure, we define the interface/logic here
        require(_asset != address(0), "Invalid asset");
        require(_interestRateModel != address(0), "Invalid model");
        
        emit ReserveInitialized(_asset, _interestRateModel);
    }
    
    function updateReserveParams(
        address _asset,
        uint256 _ltv,
        uint256 _liquidationThreshold,
        uint256 _liquidationBonus
    ) external onlyOwner {
        require(_ltv > 0, "Invalid LTV");
        require(_liquidationThreshold >= _ltv, "Invalid threshold");
        
        emit ReserveParamsUpdated(_asset, _ltv, _liquidationThreshold, _liquidationBonus);
    }
    
    function setReserveFreeze(address _asset, bool _freeze) external onlyOwner {
        if (_freeze) {
            emit ReserveFrozen(_asset);
        } else {
            emit ReserveUnfrozen(_asset);
        }
    }
}
