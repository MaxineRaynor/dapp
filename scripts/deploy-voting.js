import hre from "hardhat";
const { ethers } = hre;

async function main() {
    console.log("🚀 Starting deployment of voting contracts...");
    
    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("📝 Deploying contracts with account:", deployer.address);
    
    // Get account balance
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
    
    // Get network information
    const network = await ethers.provider.getNetwork();
    console.log("🌐 Network:", network.name, "Chain ID:", network.chainId.toString());
    
    try {
        // Deploy SimpleVoting contract
        console.log("\n📊 Deploying SimpleVoting contract...");
        const SimpleVoting = await ethers.getContractFactory("SimpleVoting");
        const simpleVoting = await SimpleVoting.deploy(
            "Should we implement FHEVM in our next project?", // description
            60 // 60 minutes voting duration
        );
        await simpleVoting.waitForDeployment();
        const simpleVotingAddress = await simpleVoting.getAddress();
        console.log("✅ SimpleVoting deployed to:", simpleVotingAddress);
        
        // Deploy EncryptedSimpleVotingSimplified contract
        console.log("\n🔐 Deploying EncryptedSimpleVotingSimplified contract...");
        const EncryptedSimpleVotingSimplified = await ethers.getContractFactory("EncryptedSimpleVotingSimplified");
        const encryptedVoting = await EncryptedSimpleVotingSimplified.deploy(
            "Should we implement FHEVM in our next project? (Encrypted)", // description
            60 // 60 minutes voting duration
        );
        await encryptedVoting.waitForDeployment();
        const encryptedVotingAddress = await encryptedVoting.getAddress();
        console.log("✅ EncryptedSimpleVotingSimplified deployed to:", encryptedVotingAddress);
        
        // Display contract information
        console.log("\n📋 Contract Deployment Summary:");
        console.log("═══════════════════════════════════════");
        console.log("🏗️  SimpleVoting:");
        console.log("   📍 Address:", simpleVotingAddress);
        console.log("   📝 Description: Should we implement FHEVM in our next project?");
        console.log("   ⏱️  Voting Duration: 60 minutes");
        
        console.log("\n🔐 EncryptedSimpleVotingSimplified:");
        console.log("   📍 Address:", encryptedVotingAddress);
        console.log("   📝 Description: Should we implement FHEVM in our next project? (Encrypted)");
        console.log("   ⏱️  Voting Duration: 60 minutes");
        console.log("   🛡️  Privacy: Full vote privacy with FHE");
        
        // Get voting information
        const simpleVotingInfo = await simpleVoting.getVotingInfo();
        const encryptedVotingInfo = await encryptedVoting.getVotingInfo();
        
        console.log("\n🗳️  Voting Status:");
        console.log("📊 SimpleVoting - Active:", simpleVotingInfo[2]);
        console.log("🔐 EncryptedSimpleVotingSimplified - Active:", encryptedVotingInfo[2]);
        
        // Save deployment info to a file
        const deploymentInfo = {
            network: network.name,
            chainId: network.chainId.toString(),
            deployer: deployer.address,
            timestamp: new Date().toISOString(),
            contracts: {
                SimpleVoting: {
                    address: simpleVotingAddress,
                    description: "Should we implement FHEVM in our next project?",
                    votingDuration: "60 minutes"
                },
                EncryptedSimpleVoting: {
                    address: encryptedVotingAddress,
                    description: "Should we implement FHEVM in our next project? (Encrypted)",
                    votingDuration: "60 minutes",
                    privacy: "Full FHE encryption"
                }
            }
        };
        
        console.log("\n💾 Deployment completed successfully!");
        
        console.log("\n🎉 Deployment completed successfully!");
        console.log("\n📝 Next steps:");
        console.log("1. Start the frontend: npm run start");
        console.log("2. Connect your wallet to the network");
        console.log("3. Interact with both voting contracts");
        console.log("4. Compare standard vs encrypted voting experience");
        
    } catch (error) {
        console.error("❌ Deployment failed:", error);
        throw error;
    }
}

// Run the deployment
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("💥 Deployment script failed:", error);
        process.exit(1);
    });