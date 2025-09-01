import { ethers } from "ethers";

async function getPrivateKeyFromMnemonic() {
    const mnemonic = "return drastic palm slush total word lemon scatter move female pave knee fiber kite leave card usage seat movie believe habit blossom public toast";
    
    try {
        // Create wallet from mnemonic
        const wallet = ethers.Wallet.fromMnemonic(mnemonic);
        
        console.log("🔑 Wallet Details:");
        console.log("Address:", wallet.address);
        console.log("Private Key:", wallet.privateKey);
        
        // Check balance on Sepolia
        const provider = new ethers.JsonRpcProvider("https://sepolia.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161");
        const balance = await provider.getBalance(wallet.address);
        
        console.log("💰 Sepolia Balance:", ethers.formatEther(balance), "ETH");
        
        if (balance === 0n) {
            console.log("⚠️  Warning: No ETH balance. Please get test ETH from:");
            console.log("   - https://sepoliafaucet.com/");
            console.log("   - https://faucet.sepolia.dev/");
        }
        
        return wallet.privateKey;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

// Run the function
getPrivateKeyFromMnemonic()
    .then((privateKey) => {
        console.log("\n✅ Private key extracted successfully");
        console.log("You can now use this for deployment");
    })
    .catch((error) => {
        console.error("❌ Failed to extract private key:", error);
    });