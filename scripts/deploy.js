import hre from "hardhat";
import fs from "fs";

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;
  
  console.log("=".repeat(60));
  console.log("🚀 BaseLend Deployment");
  console.log("=".repeat(60));
  console.log(`📍 Network: ${network}`);
  console.log(`💼 Deployer: ${deployer.address}`);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`💰 Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log("=".repeat(60));
  
  const minBalance = network === "base" ? hre.ethers.parseEther("0.01") : hre.ethers.parseEther("0.001");
  
  if (balance < minBalance) {
    console.log(`⚠️  Warning: Low balance!`);
    console.log(`   Required: ${hre.ethers.formatEther(minBalance)} ETH`);
    if (network === "base") {
      console.log(`\n🔄 Insufficient funds for Base mainnet`);
      console.log(`   Run: npx hardhat run scripts/deploy.js --network baseSepolia`);
      process.exit(1);
    }
  }
  
  try {
    console.log("\n📝 Deploying LendingPool...");
    const LendingPool = await hre.ethers.getContractFactory("LendingPool");
    const lendingPool = await LendingPool.deploy();
    await lendingPool.waitForDeployment();
    
    const address = await lendingPool.getAddress();
    console.log(`✅ LendingPool deployed: ${address}`);
    
    console.log("\n⏳ Waiting for confirmations...");
    await lendingPool.deploymentTransaction().wait(5);
    console.log("✅ Confirmed!");
    
    const deploymentInfo = {
      network,
      chainId: Number((await hre.ethers.provider.getNetwork()).chainId),
      lendingPool: address,
      deployer: deployer.address,
      timestamp: new Date().toISOString()
    };
    
    fs.writeFileSync(
      `deployment-${network}.json`,
      JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("\n" + "=".repeat(60));
    console.log("✨ Deployment Complete!");
    console.log("=".repeat(60));
    console.log(`\nVerify: npx hardhat verify --network ${network} ${address}`);
    
    const explorerBase = network === "base" ? "https://basescan.org" : "https://sepolia.basescan.org";
    console.log(`Explorer: ${explorerBase}/address/${address}`);
    
  } catch (error) {
    console.error(`\n❌ Deployment failed: ${error.message}`);
    if (network === "base") {
      console.log(`\n🔄 Try: npx hardhat run scripts/deploy.js --network baseSepolia`);
    }
    throw error;
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
