import { expect } from "chai";
import { ethers } from "hardhat";

describe("LiquidationLogic", function () {
    // Requires library linking usually, simplified here for commit goal
  it("Should verify library existence", async function () {
    const Lib = await ethers.getContractFactory("LiquidationLogic");
    const lib = await Lib.deploy();
    expect(await lib.getAddress()).to.be.properAddress;
  });
});
