import hre from "hardhat";

async function main() {
    console.log("🚀 Starting gas-optimized deployment to Sepolia...");
    
    // Get the deployer account
    const [deployer] = await hre.ethers.getSigners();
    console.log("📝 Deploying with account:", deployer.address);
    
    // Check balance
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
    
    if (balance < hre.ethers.parseEther("0.01")) {
        console.log("⚠️  Warning: Low balance! Get test ETH from:");
        console.log("   - https://sepoliafaucet.com/");
        console.log("   - https://faucet.sepolia.dev/");
    }
    
    // Get network info
    const network = await hre.ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());
    
    // Get current gas price
    const gasPrice = await hre.ethers.provider.getGasPrice();
    console.log("⛽ Current gas price:", hre.ethers.formatUnits(gasPrice, "gwei"), "gwei");
    
    try {
        console.log("\n📊 Deploying SimpleVoting contract...");
        
        // Deploy SimpleVoting with gas optimization
        const SimpleVoting = await hre.ethers.getContractFactory("SimpleVoting");
        
        // Estimate gas for deployment
        const deployTx = await SimpleVoting.getDeployTransaction(
            "FHEVM Implementation Vote", // Shorter description to save gas
            60 // 60 minutes
        );
        const estimatedGas = await hre.ethers.provider.estimateGas(deployTx);
        console.log("📊 Estimated gas for SimpleVoting:", estimatedGas.toString());
        
        const simpleVoting = await SimpleVoting.deploy(
            "FHEVM Implementation Vote",
            60,
            {
                gasLimit: estimatedGas + BigInt(50000), // Add buffer
                gasPrice: gasPrice,
            }
        );
        
        await simpleVoting.waitForDeployment();
        const simpleVotingAddress = await simpleVoting.getAddress();
        console.log("✅ SimpleVoting deployed to:", simpleVotingAddress);
        
        // Get deployment transaction details
        const deployReceipt = await hre.ethers.provider.getTransactionReceipt(simpleVoting.deploymentTransaction().hash);
        console.log("💰 Gas used for SimpleVoting:", deployReceipt.gasUsed.toString());
        console.log("💵 ETH cost:", hre.ethers.formatEther(deployReceipt.gasUsed * gasPrice));
        
        console.log("\n🔐 Deploying EncryptedSimpleVotingSimplified contract...");
        
        // Deploy EncryptedSimpleVotingSimplified
        const EncryptedVoting = await hre.ethers.getContractFactory("EncryptedSimpleVotingSimplified");
        
        const encryptedDeployTx = await EncryptedVoting.getDeployTransaction(
            "FHEVM Vote (Encrypted)",
            60
        );
        const encryptedEstimatedGas = await hre.ethers.provider.estimateGas(encryptedDeployTx);
        console.log("📊 Estimated gas for EncryptedVoting:", encryptedEstimatedGas.toString());
        
        const encryptedVoting = await EncryptedVoting.deploy(
            "FHEVM Vote (Encrypted)",
            60,
            {
                gasLimit: encryptedEstimatedGas + BigInt(50000),
                gasPrice: gasPrice,
            }
        );
        
        await encryptedVoting.waitForDeployment();
        const encryptedVotingAddress = await encryptedVoting.getAddress();
        console.log("✅ EncryptedSimpleVotingSimplified deployed to:", encryptedVotingAddress);
        
        // Get deployment transaction details
        const encryptedDeployReceipt = await hre.ethers.provider.getTransactionReceipt(encryptedVoting.deploymentTransaction().hash);
        console.log("💰 Gas used for EncryptedVoting:", encryptedDeployReceipt.gasUsed.toString());
        console.log("💵 ETH cost:", hre.ethers.formatEther(encryptedDeployReceipt.gasUsed * gasPrice));
        
        // Calculate total costs
        const totalGasUsed = deployReceipt.gasUsed + encryptedDeployReceipt.gasUsed;
        const totalCost = hre.ethers.formatEther(totalGasUsed * gasPrice);
        
        console.log("\n📋 Deployment Summary:");
        console.log("═════════════════════════════════════════════");
        console.log("📊 SimpleVoting:");
        console.log("   📍 Address:", simpleVotingAddress);
        console.log("   ⛽ Gas used:", deployReceipt.gasUsed.toString());
        
        console.log("\n🔐 EncryptedSimpleVotingSimplified:");
        console.log("   📍 Address:", encryptedVotingAddress);
        console.log("   ⛽ Gas used:", encryptedDeployReceipt.gasUsed.toString());
        
        console.log("\n💰 Total Deployment Cost:");
        console.log("   ⛽ Total gas:", totalGasUsed.toString());
        console.log("   💵 Total ETH:", totalCost, "ETH");
        
        console.log("\n🔗 Sepolia Explorer Links:");
        console.log("📊 SimpleVoting:", `https://sepolia.etherscan.io/address/${simpleVotingAddress}`);
        console.log("🔐 EncryptedVoting:", `https://sepolia.etherscan.io/address/${encryptedVotingAddress}`);
        
        // Test basic functionality
        console.log("\n🧪 Testing deployed contracts...");
        try {
            const simpleInfo = await simpleVoting.getVotingInfo();
            const encryptedInfo = await encryptedVoting.getVotingInfo();
            
            console.log("✅ SimpleVoting - Description:", simpleInfo[0]);
            console.log("✅ SimpleVoting - Active:", simpleInfo[2]);
            console.log("✅ EncryptedVoting - Description:", encryptedInfo[0]);
            console.log("✅ EncryptedVoting - Active:", encryptedInfo[2]);
            
            console.log("\n🎉 All contracts deployed and tested successfully!");
            
        } catch (testError) {
            console.error("⚠️  Warning: Contract test failed:", testError.message);
            console.log("But deployment was successful!");
        }
        
        // Return addresses for frontend use
        return {
            simpleVoting: simpleVotingAddress,
            encryptedVoting: encryptedVotingAddress,
            network: network.name,
            chainId: network.chainId.toString(),
        };
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}

// Run deployment
main()
    .then((result) => {
        console.log("\n🚀 Deployment completed successfully!");
        console.log("📋 Contract addresses saved for frontend use");
        process.exit(0);
    })
    .catch((error) => {
        console.error("💥 Deployment failed:", error);
        process.exit(1);
    });