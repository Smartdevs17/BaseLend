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
  });
});
