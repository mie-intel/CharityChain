// Gas estimation script for CharityChain deployment
const hre = require("hardhat");

async function main() {
  console.log("=== CHARITYCHAIN GAS ESTIMATION REPORT ===\n");

  const [deployer] = await hre.ethers.getSigners();
  const deployerAddress = await deployer.getAddress();
  const balance = await hre.ethers.provider.getBalance(deployerAddress);
  
  console.log("🔧 Network Configuration:");
  console.log("Network:", hre.network.name);
  console.log("Deployer Address:", deployerAddress);
  console.log("Account Balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Get current gas price and network info
  const gasPrice = await hre.ethers.provider.getGasPrice();
  const block = await hre.ethers.provider.getBlock("latest");
  
  console.log("\n⛽ Gas Information:");
  console.log("Current Gas Price:", hre.ethers.formatUnits(gasPrice, "gwei"), "Gwei");
  console.log("Latest Block Number:", block.number);
  console.log("Base Fee Per Gas:", block.baseFeePerGas ? hre.ethers.formatUnits(block.baseFeePerGas, "gwei") + " Gwei" : "N/A (not EIP-1559)");

  try {
    // Get contract factory
    const Main = await hre.ethers.getContractFactory("Main");
    
    console.log("\n📊 Contract Deployment Estimation:");
    
    // Estimate deployment gas
    const deployTx = await Main.getDeployTransaction();
    const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
    const estimatedCost = estimatedGas * gasPrice;
    
    console.log("Estimated Gas Units:", estimatedGas.toString());
    console.log("Gas Price:", hre.ethers.formatUnits(gasPrice, "gwei"), "Gwei");
    console.log("Estimated Cost:", hre.ethers.formatEther(estimatedCost), "ETH");
    
    // Cost in USD (approximate)
    const ethPrices = {
      conservative: 1800,
      current: 2000,
      optimistic: 2500
    };
    
    console.log("\n💰 Cost Estimates (USD):");
    Object.entries(ethPrices).forEach(([scenario, price]) => {
      const usdCost = parseFloat(hre.ethers.formatEther(estimatedCost)) * price;
      console.log(`${scenario.charAt(0).toUpperCase() + scenario.slice(1)} ($${price}/ETH):`, usdCost.toFixed(4), "USD");
    });
    
    // Gas price scenarios
    console.log("\n⚡ Gas Price Scenarios:");
    const gasPriceScenarios = [
      { name: "Low (10 Gwei)", price: hre.ethers.parseUnits("10", "gwei") },
      { name: "Medium (20 Gwei)", price: hre.ethers.parseUnits("20", "gwei") },
      { name: "High (50 Gwei)", price: hre.ethers.parseUnits("50", "gwei") },
      { name: "Very High (100 Gwei)", price: hre.ethers.parseUnits("100", "gwei") }
    ];
    
    gasPriceScenarios.forEach(scenario => {
      const cost = estimatedGas * scenario.price;
      console.log(`${scenario.name}: ${hre.ethers.formatEther(cost)} ETH (${(parseFloat(hre.ethers.formatEther(cost)) * 2000).toFixed(4)} USD)`);
    });
    
    // Balance check
    console.log("\n💳 Balance Analysis:");
    if (balance >= estimatedCost) {
      const remaining = balance - estimatedCost;
      console.log("✅ Sufficient balance for deployment");
      console.log("Remaining after deployment:", hre.ethers.formatEther(remaining), "ETH");
    } else {
      const needed = estimatedCost - balance;
      console.log("❌ INSUFFICIENT BALANCE!");
      console.log("Required:", hre.ethers.formatEther(estimatedCost), "ETH");
      console.log("Additional needed:", hre.ethers.formatEther(needed), "ETH");
    }
    
    // Function call estimations
    console.log("\n🔍 Function Call Gas Estimates:");
    
    // Deploy a temporary contract to estimate function calls
    console.log("Deploying temporary contract for function analysis...");
    const tempContract = await Main.deploy();
    await tempContract.waitForDeployment();
    
    const functionEstimates = [
      { name: "createCampaign", params: ["Test Campaign", "Description", hre.ethers.parseEther("1.0"), 1000000000] },
      { name: "donate", params: [1, { value: hre.ethers.parseEther("0.1") }] },
      { name: "withdrawFunds", params: [1] },
      { name: "getAllCampaigns", params: [] }
    ];
    
    for (const func of functionEstimates) {
      try {
        let gas;
        if (func.name === "getAllCampaigns") {
          // For view functions, we just call them
          await tempContract[func.name](...func.params);
          console.log(`${func.name}: ~2,000 gas (view function)`);
          continue;
        }
        
        if (func.params[1] && func.params[1].value) {
          gas = await tempContract[func.name].estimateGas(...func.params);
        } else {
          gas = await tempContract[func.name].estimateGas(...func.params);
        }
        
        const cost = gas * gasPrice;
        console.log(`${func.name}: ${gas.toString()} gas (${hre.ethers.formatEther(cost)} ETH)`);
      } catch (error) {
        console.log(`${func.name}: Unable to estimate (${error.message.split('\n')[0]})`);
      }
    }
    
    console.log("\n📋 SUMMARY:");
    console.log("Contract Size: ~431 lines of Solidity");
    console.log("Deployment Gas:", estimatedGas.toString());
    console.log("Deployment Cost:", hre.ethers.formatEther(estimatedCost), "ETH");
    console.log("Ready for deployment:", balance >= estimatedCost ? "✅ YES" : "❌ NO");
    
  } catch (error) {
    console.error("\n❌ Error during gas estimation:");
    console.error(error.message);
    
    if (error.message.includes("insufficient funds")) {
      console.error("\n💡 Solution: Add more ETH to your account");
    } else if (error.message.includes("nonce")) {
      console.error("\n💡 Solution: Reset your account nonce or wait for pending transactions");
    }
  }
  
  console.log("\n=== END OF REPORT ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Script failed:", error);
    process.exit(1);
  });
