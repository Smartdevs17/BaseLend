const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");

describe("InterestRateModel", function () {
  async function deployFixture() {
    const [owner, otherAccount] = await ethers.getSigners();

    const InterestRateModel = await ethers.getContractFactory("InterestRateModel");
    const model = await InterestRateModel.deploy();

    return { model, owner, otherAccount };
  }

  describe("Configuration", function () {
    it("Should deploy with default values", async function () {
      const { model } = await loadFixture(deployFixture);
      
      expect(await model.baseRate()).to.equal(200);
      expect(await model.multiplier()).to.equal(1000);
      expect(await model.jumpMultiplier()).to.equal(5000);
      expect(await model.kink()).to.equal(8000);
    });

    it("Should update rates successfully", async function () {
      const { model, owner } = await loadFixture(deployFixture);
      
      await expect(model.connect(owner).updateRates(100, 800, 4000, 7000))
        .to.emit(model, "RatesUpdated")
        .withArgs(100, 800, 4000, 7000);
        
      expect(await model.baseRate()).to.equal(100);
      expect(await model.multiplier()).to.equal(800);
    });
  });

  describe("Borrow Rate", function () {
    it("Should calculate correct rate at 0% utilization", async function () {
      const { model } = await loadFixture(deployFixture);
      // Base rate = 2% (200 bps)
      expect(await model.getBorrowRate(0)).to.equal(200);
    });

    it("Should calculate correct rate at 50% utilization", async function () {
      const { model } = await loadFixture(deployFixture);
      // Below kink (80%). Rate = Base + (Util * Multiplier)
      // 200 + (5000 * 1000 / 10000) = 200 + 500 = 700 (7%)
      expect(await model.getBorrowRate(5000)).to.equal(700);
    });

    it("Should calculate correct rate at 100% utilization", async function () {
      const { model } = await loadFixture(deployFixture);
      // Above kink (80%). Rate = Normal + (Excess * Jump)
      // Normal = 200 + (8000 * 1000 / 10000) = 1000 (10%)
      // Excess = 10000 - 8000 = 2000
      // Jump = 2000 * 5000 / 10000 = 1000 (10%)
      // Total = 1000 + 1000 = 2000 (20%)
      expect(await model.getBorrowRate(10000)).to.equal(2000);
    });
  });

  describe("Supply Rate", function () {
    it("Should calculate correct supply rate", async function () {
      const { model } = await loadFixture(deployFixture);
      
      // Utilization 50% (5000 bps)
      // Borrow Rate = 7% (700 bps)
      // Reserve Factor = 10% (1000 bps)
      // RateToPool = 700 * (1 - 0.10) = 630
      // Supply Rate = 5000 * 630 / 10000 = 315 (3.15%)
      
      expect(await model.getSupplyRate(5000, 1000)).to.equal(315);
    });
  });
});
