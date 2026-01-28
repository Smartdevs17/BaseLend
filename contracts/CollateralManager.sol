// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CollateralManager
 * @dev Manage collateral for lending positions
 */
contract CollateralManager is Ownable {
    
    /**
     * @notice Represents a borrower's collateral position
     * @param borrower The address that deposited the collateral
     * @param collateralToken The ERC20 token used as collateral
     * @param amount The quantity of tokens locked
     * @param lockedAt The timestamp when the deposit occurred
     * @param isActive Whether the position is currently open
     */
    struct CollateralPosition {
        address borrower;
        address collateralToken;
        uint256 amount;
        uint256 lockedAt;
        bool isActive;
    }
    
    /// @notice Maps position ID to its details
    mapping(uint256 => CollateralPosition) public positions;
    
    /// @notice Tracks which tokens are accepted as collateral
    mapping(address => bool) public supportedCollateral;
    
    /// @notice Minimum collateralization ratio per token (in basis points, 10000 = 100%)
    mapping(address => uint256) public collateralRatios;
    
    /// @dev Internal counter for assigning unique position IDs
    uint256 private _positionIdCounter;
    
    event CollateralDeposited(uint256 indexed positionId, address indexed borrower, uint256 amount);
    event CollateralWithdrawn(uint256 indexed positionId, uint256 amount);
    event CollateralLiquidated(uint256 indexed positionId, uint256 amount);
    
    constructor() Ownable(msg.sender) {
        _positionIdCounter = 1;
    }
    
    function addSupportedCollateral(address _token, uint256 _ratio) external onlyOwner {
        require(_token != address(0), "Invalid token");
        require(_ratio >= 10000, "Ratio must be >= 100%");
        
        supportedCollateral[_token] = true;
        collateralRatios[_token] = _ratio;
    }
    
    function depositCollateral(address _token, uint256 _amount) external returns (uint256) {
        require(supportedCollateral[_token], "Token not supported");
        require(_amount > 0, "Amount must be > 0");
        
        uint256 positionId = _positionIdCounter++;
        
        positions[positionId] = CollateralPosition({
            borrower: msg.sender,
            collateralToken: _token,
            amount: _amount,
            lockedAt: block.timestamp,
            isActive: true
        });
        
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        
        emit CollateralDeposited(positionId, msg.sender, _amount);
        
        return positionId;
    }
    
    function withdrawCollateral(uint256 _positionId, uint256 _amount) external {
        CollateralPosition storage position = positions[_positionId];
        require(position.borrower == msg.sender, "Not borrower");
        require(position.isActive, "Position not active");
        require(position.amount >= _amount, "Insufficient collateral");
        
        position.amount -= _amount;
        
        if (position.amount == 0) {
            position.isActive = false;
        }
        
        IERC20(position.collateralToken).transfer(msg.sender, _amount);
        
        emit CollateralWithdrawn(_positionId, _amount);
    }
    
    function liquidatePosition(uint256 _positionId) external onlyOwner {
        CollateralPosition storage position = positions[_positionId];
        require(position.isActive, "Position not active");
        
        uint256 amount = position.amount;
        position.amount = 0;
        position.isActive = false;
        
        IERC20(position.collateralToken).transfer(owner(), amount);
        
        emit CollateralLiquidated(_positionId, amount);
    }
    
    function getMaxBorrow(uint256 _positionId) external view returns (uint256) {
        CollateralPosition memory position = positions[_positionId];
        uint256 ratio = collateralRatios[position.collateralToken];
        
        return (position.amount * 10000) / ratio;
    }
}
