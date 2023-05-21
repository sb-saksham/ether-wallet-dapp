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
    }
  }
};
