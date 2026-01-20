import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers.js";

describe("FlashLoan", function () {
  async function deployFixture() {
    const [owner, user] = await ethers.getSigners();
    
    const FlashLoan = await ethers.getContractFactory("FlashLoan");
    const flashLoan = await FlashLoan.deploy();
    
    // In a real test we need a mock ERC20 or configured pool
    // For now we test deployment and basic params
    
    return { flashLoan, owner };
  }
  
  describe("Configuration", function () {
    it("Should have correct fee", async function () {
      const { flashLoan } = await loadFixture(deployFixture);
      expect(await flashLoan.FLASH_LOAN_FEE()).to.equal(9);
    });
  });
});
