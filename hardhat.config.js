require("@nomicfoundation/hardhat-toolbox");

// Task to list all accounts

task(
  'accounts',
  'Print List of all accounts with balances',
  async (taskArgs, hre) => {
    const accounts = await hre.ethers.getSigners();
    for (const account of accounts) {
      const balance = await account.getBalance();
      console.log(account + " : " + balance);
    }
  }
)
const API_SEPOLIA_KEY = "PF-BRAa65EWNg_chNAgVzPlwX_ScyX2K";
const PRIVATE_KEY = "c2e30e588048137558857889b1f99602ff7f5f8ece130d7a74c3e3c853d0a183";
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  paths: {
    sources: './contracts',
    artifacts: './src/artifacts'
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainID: 1337
    },
    goerli: {
      url: 'https://goerli-testnet-node-url.com',
      // accounts: [privateKey1, privateKey2]
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${API_SEPOLIA_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  }
};
