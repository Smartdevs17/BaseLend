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
});
