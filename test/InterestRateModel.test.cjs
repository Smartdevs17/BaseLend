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
});
