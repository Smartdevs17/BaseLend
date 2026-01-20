import hre from "hardhat";

/**
 * Smart deployment script with automatic network fallback for BaseLend
 */

async function deployWithFallback() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=".repeat(60));
  console.log("🚀 BaseLend Smart Deployment");
  console.log("=".repeat(60));
  console.log(`📍 Network: ${network}`);
  console.log(`💼 Deployer: ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);

  if (balance === 0n) {
      console.log("⚠️  Warning: Zero balance detected!");
      if (network === "base") {
          throw new Error("Insufficient funds for Base Mainnet");
      }
  }

  const deployed = {};

  try {
    // 1. Deploy AddressesProvider
    const AddressesProvider = await hre.ethers.getContractFactory("LendingPoolAddressesProvider");
    const provider = await AddressesProvider.deploy();
    await provider.waitForDeployment();
    deployed.AddressesProvider = await provider.getAddress();
    console.log(`✅ AddressesProvider: ${deployed.AddressesProvider}`);

    // 2. Deploy LendingPool
    const LendingPool = await hre.ethers.getContractFactory("LendingPool");
    const pool = await LendingPool.deploy();
    await pool.waitForDeployment();
    deployed.LendingPool = await pool.getAddress();
    console.log(`✅ LendingPool: ${deployed.LendingPool}`);

    // 3. Deploy ProtocolDataProvider
    const ProtocolDataProvider = await hre.ethers.getContractFactory("ProtocolDataProvider");
    const dataProvider = await ProtocolDataProvider.deploy(deployed.AddressesProvider);
    await dataProvider.waitForDeployment();
    deployed.ProtocolDataProvider = await dataProvider.getAddress();
    console.log(`✅ ProtocolDataProvider: ${deployed.ProtocolDataProvider}`);

    // Save
    const fs = await import('fs');
    fs.writeFileSync(`deployment-${network}.json`, JSON.stringify(deployed, null, 2));
    console.log(`\n📄 Deployment info saved to deployment-${network}.json`);

  } catch (error) {
    console.error(`❌ Deployment failed: ${error.message}`);
    if (network === "base") {
        console.log("🔄 Try running with --network baseSepolia");
    }
    throw error;
  }
}

deployWithFallback().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
