// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title FlashLoan
 * @dev Simple Flash Loan implementation for BaseLend
 */
contract FlashLoan is ReentrancyGuard, Ownable {
    
    uint256 public constant FLASH_LOAN_FEE = 9; // 0.09% fee
    
    event FlashLoanExecuted(address indexed target, address indexed asset, uint256 amount, uint256 fee);
    
    constructor() Ownable(msg.sender) {}
    
    function executeFlashLoan(
        address _receiver,
        address _asset,
        uint256 _amount,
        bytes calldata _params
    ) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        
        uint256 fee = (_amount * FLASH_LOAN_FEE) / 10000;
        uint256 totalDebt = _amount + fee;
        
        IERC20 token = IERC20(_asset);
        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= _amount, "Insufficient pool liquidity");
        
        // Transfer funds to receiver
        token.transfer(_receiver, _amount);
        
        // Call executeOperation on receiver (interface omitted for brevity in this step)
        // IFlashLoanReceiver(_receiver).executeOperation(_asset, _amount, fee, msg.sender, _params);
        
        // Validate repayment
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore + fee, "Flash loan not repaid");
        
        emit FlashLoanExecuted(_receiver, _asset, _amount, fee);
    }
    
    function withdrawFees(address _asset) external onlyOwner {
        IERC20 token = IERC20(_asset);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }
}
