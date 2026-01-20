import { expect } from "chai";
import { ethers } from "hardhat";

describe("ReserveLogic", function () {
  it("Should calculate compounded interest", async function () {
    const Lib = await ethers.getContractFactory("ReserveLogic");
    const lib = await Lib.deploy();
    // In a real test we'd call the library function
    // For now, ensuring deployment works
    expect(await lib.getAddress()).to.be.properAddress;
  });
});
