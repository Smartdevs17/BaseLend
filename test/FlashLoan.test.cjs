const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("FlashLoan", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();

    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy();
    
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Token", "TKN");
    
    const MockReceiver = await ethers.getContractFactory("MockFlashLoanReceiver");
    const receiver = await MockReceiver.deploy();
    
    // Fund the pool
    const liquidity = ethers.parseEther("1000");
    await token.mint(flashLoan.getAddress(), liquidity);

    return { flashLoan, token, receiver, owner, user };
  }

  describe("Execution", function () {
    it("Should execute flash loan successfully", async function () {
      const { flashLoan, token, receiver, owner } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      // Fee is 0.09% = 9 bps
      const fee = (amount * 9n) / 10000n;
      
      // Give receiver enough tokens to pay the fee (since it doesn't do arbitrage in test)
      await token.mint(receiver.getAddress(), fee);
      
      await expect(flashLoan.executeFlashLoan(
        await receiver.getAddress(),
        await token.getAddress(),
        amount,
        "0x"
      )).to.emit(flashLoan, "FlashLoanExecuted")
        .withArgs(await receiver.getAddress(), await token.getAddress(), amount, fee);
        
      // Pool should have more funds (liquidity + fee)
      const liquidity = ethers.parseEther("1000");
      expect(await token.balanceOf(await flashLoan.getAddress())).to.equal(liquidity + fee);
    });

    it("Should revert if repayment is missing", async function () {
      const { flashLoan, token, receiver } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      
      await receiver.setFailRepayment(true);
      
      await expect(flashLoan.executeFlashLoan(
        await receiver.getAddress(),
        await token.getAddress(),
        amount,
        "0x"
      )).to.be.revertedWith("Flash loan not repaid");
    });
  });
});
