const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("LiquidationLogic", function () {
  async function deployFixture() {
    const MockLogic = await ethers.getContractFactory("MockLiquidationLogic");
    const mock = await MockLogic.deploy();
    return { mock };
  }

  describe("Calculation", function () {
    it("Should calculate correct liquidation amount with bonus", async function () {
      const { mock } = await loadFixture(deployFixture);
      
      const debt = ethers.parseEther("100");
      const bonus = 500; // 5%
      
      // Expected = 100 * (1.05) = 105
      const expected = ethers.parseEther("105");
      
      expect(await mock.calculateLiquidationAmount(debt, ethers.parseEther("200"), bonus))
        .to.equal(expected);
    });

    it("Should return 0 if collateral is 0", async function () {
      const { mock } = await loadFixture(deployFixture);
      expect(await mock.calculateLiquidationAmount(100, 0, 500)).to.equal(0);
    });
  });
});
