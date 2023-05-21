const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');
const { expect } = require('chai');
const { ethers } = require('hardhat');

describe("EtherWallet", function () { 
    async function deployFixture() {
        const [owner, otherAcc] = await ethers.getSigners();
        const EtherWallet = await ethers.getContractFactory("EtherWallet");
        const etherWallet = await EtherWallet.deploy();
        await etherWallet.deployed();
        return { owner, otherAcc, etherWallet };
    }
    describe("Deployment", function () {
        it("Deploys the contract and set owner to deployer", async function () {
            const { owner, etherWallet } = await loadFixture(deployFixture);
            expect(await etherWallet.owner()).to.equal(owner.address);
        })
    })
    describe("Deposit", function () {
        it("Deploys the contract and set owner to deployer", async function () {
            
        })
    })
    describe("Deployment", function () {
        it("Deploys the contract and set owner to deployer", async function () {
            
        })
    })
});