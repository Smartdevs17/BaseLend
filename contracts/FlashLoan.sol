// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title FlashLoan
 * @dev Simple Flash Loan implementation for BaseLend
 */
interface IFlashLoanReceiver {
    function executeOperation(
        address asset,
        uint256 amount,
        uint256 premium,
        address initiator,
        bytes calldata params
    ) external returns (bool);
}

contract FlashLoan is ReentrancyGuard, Ownable {
    
    /// @notice The fee charged for each flash loan in basis points (e.g., 9 = 0.09%)
    uint256 public constant FLASH_LOAN_FEE = 9; // 0.09% fee
    
    /**
     * @notice Emitted when a flash loan is successfully executed and repaid
     * @param target The address of the receiver that performed the operation
     * @param asset The address of the token borrowed
     * @param amount The principal amount borrowed
     * @param fee The fee amount paid on top of principal
     */
    event FlashLoanExecuted(address indexed target, address indexed asset, uint256 amount, uint256 fee);
    
    constructor() Ownable(msg.sender) {}
    
    /**
     * @notice Initiates a flash loan
     * @dev Funds are transferred, a callback is executed, and repayment is verified in one transaction
     * @param _receiver The address that will receive the funds and perform logic
     * @param _asset The ERC20 token to borrow
     * @param _amount The quantity in WEI to borrow
     * @param _params Encoded data to pass to the receiver's callback
     */
    function executeFlashLoan(
        address _receiver,
        address _asset,
        uint256 _amount,
        bytes calldata _params
    ) external nonReentrant {
        require(_amount > 0, "Amount must be > 0");
        
        uint256 fee = (_amount * FLASH_LOAN_FEE) / 10000;
        
        IERC20 token = IERC20(_asset);
        uint256 balanceBefore = token.balanceOf(address(this));
        require(balanceBefore >= _amount, "Insufficient pool liquidity");
        
        // Transfer funds to receiver
        token.transfer(_receiver, _amount);
        
        // Call executeOperation on receiver
        IFlashLoanReceiver(_receiver).executeOperation(_asset, _amount, fee, msg.sender, _params);
        
        // Validate repayment
        uint256 balanceAfter = token.balanceOf(address(this));
        require(balanceAfter >= balanceBefore + fee, "Flash loan not repaid");
        
        emit FlashLoanExecuted(_receiver, _asset, _amount, fee);
    }
    
    /**
     * @notice Allows the protocol owner to collect accumulated fees
     * @dev Transfers the entire token balance of the contract to the owner
     * @param _asset The address of the token to withdraw
     */
    function withdrawFees(address _asset) external onlyOwner {
        IERC20 token = IERC20(_asset);
        uint256 balance = token.balanceOf(address(this));
        token.transfer(owner(), balance);
    }
}
