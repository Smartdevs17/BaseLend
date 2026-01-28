const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("CollateralManager", function () {
  async function deployFixture() {
    const [owner, user1, user2] = await ethers.getSigners();

    const CollateralManager = await ethers.getContractFactory("CollateralManager");
    const manager = await CollateralManager.deploy();
    
    const MockERC20 = await ethers.getContractFactory("MockERC20");
    const token = await MockERC20.deploy("Collateral", "COL");

    return { manager, token, owner, user1, user2 };
  }

  describe("Configuration", function () {
    it("Should add supported collateral successfully", async function () {
      const { manager, token } = await loadFixture(deployFixture);
      
      await manager.addSupportedCollateral(await token.getAddress(), 15000); // 150%
      
      expect(await manager.supportedCollateral(await token.getAddress())).to.equal(true);
      expect(await manager.collateralRatios(await token.getAddress())).to.equal(15000);
    });

    it("Should revert with invalid ratio", async function () {
      const { manager, token } = await loadFixture(deployFixture);
      
      await expect(
        manager.addSupportedCollateral(await token.getAddress(), 5000)
      ).to.be.revertedWith("Ratio must be >= 100%");
    });
  });

  describe("Deposit", function () {
    it("Should deposit collateral successfully", async function () {
      const { manager, token, user1 } = await loadFixture(deployFixture);
      
      await manager.addSupportedCollateral(await token.getAddress(), 15000);
      
      const amount = ethers.parseEther("100");
      await token.mint(user1.address, amount);
      await token.connect(user1).approve(await manager.getAddress(), amount);
      
      await expect(manager.connect(user1).depositCollateral(await token.getAddress(), amount))
        .to.emit(manager, "CollateralDeposited")
        .withArgs(1, user1.address, amount);
        
      const position = await manager.positions(1);
      expect(position.borrower).to.equal(user1.address);
      expect(position.amount).to.equal(amount);
      expect(position.isActive).to.equal(true);
    });

    it("Should revert on unsupported token", async function () {
      const { manager, token, user1 } = await loadFixture(deployFixture);
      
      await expect(
        manager.connect(user1).depositCollateral(await token.getAddress(), 100)
      ).to.be.revertedWith("Token not supported");
    });
  });

  describe("Withdraw", function () {
    it("Should withdraw collateral successfully", async function () {
      const { manager, token, user1 } = await loadFixture(deployFixture);
      
      await manager.addSupportedCollateral(await token.getAddress(), 15000);
      const amount = ethers.parseEther("100");
      await token.mint(user1.address, amount);
      await token.connect(user1).approve(await manager.getAddress(), amount);
      await manager.connect(user1).depositCollateral(await token.getAddress(), amount);
      
      await expect(manager.connect(user1).withdrawCollateral(1, amount))
        .to.emit(manager, "CollateralWithdrawn")
        .withArgs(1, amount);
        
      const position = await manager.positions(1);
      expect(position.amount).to.equal(0);
      expect(position.isActive).to.equal(false);
    });

    it("Should revert if not borrower", async function () {
      const { manager, token, user1, user2 } = await loadFixture(deployFixture);
      
      await manager.addSupportedCollateral(await token.getAddress(), 15000);
      const amount = ethers.parseEther("100");
      await token.mint(user1.address, amount);
      await token.connect(user1).approve(await manager.getAddress(), amount);
      await manager.connect(user1).depositCollateral(await token.getAddress(), amount);
      
      await expect(
        manager.connect(user2).withdrawCollateral(1, amount)
      ).to.be.revertedWith("Not borrower");
    });
  });

  describe("Liquidation", function () {
    it("Should liquidate position successfully", async function () {
      const { manager, token, owner, user1 } = await loadFixture(deployFixture);
      
      await manager.addSupportedCollateral(await token.getAddress(), 15000);
      const amount = ethers.parseEther("100");
      await token.mint(user1.address, amount);
      await token.connect(user1).approve(await manager.getAddress(), amount);
      await manager.connect(user1).depositCollateral(await token.getAddress(), amount);
      
      await expect(manager.connect(owner).liquidatePosition(1))
        .to.emit(manager, "CollateralLiquidated")
        .withArgs(1, amount);
        
      const position = await manager.positions(1);
      expect(position.amount).to.equal(0);
      expect(position.isActive).to.equal(false);
      
      // Check owner received funds
      const initialSupply = ethers.parseUnits("1000000", 18);
      expect(await token.balanceOf(owner.address)).to.equal(initialSupply + amount);
    });
  });
});
