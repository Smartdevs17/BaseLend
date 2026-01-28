const { expect } = require("chai");
const hre = require("hardhat");
const { ethers } = hre;
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("LendingPool", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();
    
    // Deploy Mock Tokens
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const tokenA = await MockERC20.deploy("Token A", "TKNA");
    const tokenB = await MockERC20.deploy("Token B", "TKNB");

    const LendingPool = await ethers.getContractFactory("LendingPool");
    const lendingPool = await LendingPool.deploy();
    
    // Whitelist tokens
    await lendingPool.addSupportedToken(await tokenA.getAddress());
    await lendingPool.addSupportedToken(await tokenB.getAddress());

    return { lendingPool, tokenA, tokenB, owner, user1, user2 };
  }
  
  describe("Deposit", function () {
    it("Should deposit tokens successfully", async function () {
      const { lendingPool, tokenA, user1 } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      await tokenA.mint(user1.address, amount);
      await tokenA.connect(user1).approve(await lendingPool.getAddress(), amount);
      
      await expect(lendingPool.connect(user1).deposit(await tokenA.getAddress(), amount))
        .to.emit(lendingPool, "Deposited")
        .withArgs(user1.address, await tokenA.getAddress(), amount);
      
      const deposit = await lendingPool.deposits(user1.address, await tokenA.getAddress());
      expect(deposit.amount).to.equal(amount);
    });

    it("Should revert when depositing unsupported token", async function () {
      const { lendingPool, user1 } = await loadFixture(deployFixture);
      const MockERC20 = await ethers.getContractFactory("MockERC20");
      const unsupportedToken = await MockERC20.deploy("Unsupported", "UNS");
      
      await expect(
        lendingPool.connect(user1).deposit(await unsupportedToken.getAddress(), 100)
      ).to.be.revertedWith("Token not supported");
    });

    it("Should revert when depositing zero amount", async function () {
      const { lendingPool, tokenA, user1 } = await loadFixture(deployFixture);
      
      await expect(
        lendingPool.connect(user1).deposit(await tokenA.getAddress(), 0)
      ).to.be.revertedWith("Amount must be > 0");
    });
  });

  describe("Withdraw", function () {
    it("Should withdraw tokens successfully", async function () {
      const { lendingPool, tokenA, user1 } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      await tokenA.mint(user1.address, amount);
      await tokenA.connect(user1).approve(await lendingPool.getAddress(), amount);
      await lendingPool.connect(user1).deposit(await tokenA.getAddress(), amount);
      
      const withdrawAmount = ethers.parseEther("50");
      await expect(lendingPool.connect(user1).withdraw(await tokenA.getAddress(), withdrawAmount))
        .to.emit(lendingPool, "Withdrawn")
        .withArgs(user1.address, await tokenA.getAddress(), withdrawAmount);
        
      const deposit = await lendingPool.deposits(user1.address, await tokenA.getAddress());
      expect(deposit.amount).to.equal(amount - withdrawAmount);
    });

    it("Should revert when withdrawing more than balance", async function () {
      const { lendingPool, tokenA, user1 } = await loadFixture(deployFixture);
      
      const amount = ethers.parseEther("100");
      await tokenA.mint(user1.address, amount);
      await tokenA.connect(user1).approve(await lendingPool.getAddress(), amount);
      await lendingPool.connect(user1).deposit(await tokenA.getAddress(), amount);
      
      await expect(
        lendingPool.connect(user1).withdraw(await tokenA.getAddress(), amount + 1n)
      ).to.be.revertedWith("Insufficient balance");
    });
  });
  });

  describe("Borrow", function () {
    it("Should borrow tokens successfully", async function () {
      const { lendingPool, tokenA, tokenB, user1, owner } = await loadFixture(deployFixture);
      
      // Setup: Pool has liquidity
      const liquidityAmount = ethers.parseEther("1000");
      await tokenB.mint(owner.address, liquidityAmount);
      await tokenB.connect(owner).approve(await lendingPool.getAddress(), liquidityAmount);
      await lendingPool.connect(owner).deposit(await tokenB.getAddress(), liquidityAmount);

      // Setup: User has collateral
      const collateralAmount = ethers.parseEther("150"); // 150% collateral ratio
      const borrowAmount = ethers.parseEther("100");
      
      await tokenA.mint(user1.address, collateralAmount);
      await tokenA.connect(user1).approve(await lendingPool.getAddress(), collateralAmount);
      
      await expect(lendingPool.connect(user1).borrow(
        await tokenB.getAddress(),
        borrowAmount,
        await tokenA.getAddress(),
        collateralAmount,
        365 * 24 * 60 * 60 // 1 year
      )).to.emit(lendingPool, "LoanCreated");
      
      const loan = await lendingPool.loans(1);
      expect(loan.borrower).to.equal(user1.address);
      expect(loan.amount).to.equal(borrowAmount);
      expect(loan.isActive).to.equal(true);
    });
  });

  describe("Repay", function () {
    it("Should repay loan successfully", async function () {
      const { lendingPool, tokenA, tokenB, user1, owner } = await loadFixture(deployFixture);
      
      // Setup liquidity and loan
      const liquidityAmount = ethers.parseEther("1000");
      await tokenB.mint(owner.address, liquidityAmount);
      await tokenB.connect(owner).approve(await lendingPool.getAddress(), liquidityAmount);
      await lendingPool.connect(owner).deposit(await tokenB.getAddress(), liquidityAmount);

      const collateralAmount = ethers.parseEther("150");
      const borrowAmount = ethers.parseEther("100");
      
      await tokenA.mint(user1.address, collateralAmount);
      await tokenA.connect(user1).approve(await lendingPool.getAddress(), collateralAmount);
      await lendingPool.connect(user1).borrow(await tokenB.getAddress(), borrowAmount, await tokenA.getAddress(), collateralAmount, 365 * 24 * 60 * 60);

      // Repay Setup
      // Mint extra tokens to user1 for interest payment
      const repayAmount = ethers.parseEther("110"); 
      await tokenB.mint(user1.address, repayAmount);
      await tokenB.connect(user1).approve(await lendingPool.getAddress(), repayAmount);
      
      await expect(lendingPool.connect(user1).repay(1, await tokenB.getAddress()))
        .to.emit(lendingPool, "LoanRepaid")
        .withArgs(1, user1.address);
        
      const loan = await lendingPool.loans(1);
      expect(loan.isRepaid).to.equal(true);
      expect(loan.isActive).to.equal(false);
    });
  });
});
