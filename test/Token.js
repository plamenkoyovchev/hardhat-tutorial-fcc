const { expect } = require("chai");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
	async function deployTokenFixture() {
		const tokenContract = await ethers.getContractFactory("Token");

		// First address is the contract owner
		// The other addresses are the addresses from Hardhat local blockchain network
		const [owner, addr1, addr2] = await ethers.getSigners();

		const hardhatToken = await tokenContract.deploy();

		await hardhatToken.deployed();

		// Fixtures can return anything you consider useful for your tests
		return { tokenContract, hardhatToken, owner, addr1, addr2 };
	}

	it("Deployment should assign the total supply of tokens to the owner", async function () {
		const { hardhatToken, owner } = await loadFixture(deployTokenFixture);

		const ownerBalance = await hardhatToken.balanceOf(owner.address);
		expect(await hardhatToken.TOTAL_SUPPLY()).to.equal(ownerBalance);
	});

	it("Should transfer tokens between accounts", async function () {
		const { hardhatToken, owner, addr1, addr2 } = await loadFixture(
			deployTokenFixture
		);

		// Transfer 50 tokens from owner to addr1
		await hardhatToken.transfer(addr1.address, 50);
		expect(await hardhatToken.balanceOf(addr1.address)).to.equal(50);

		// Transfer 50 tokens from addr1 to addr2
		await hardhatToken.connect(addr1).transfer(addr2.address, 50);
		expect(await hardhatToken.balanceOf(addr2.address)).to.equal(50);
		expect(await hardhatToken.balanceOf(addr1.address)).to.equal(0);

		// Other way to test transfer of tokens

		// Transfer 50 tokens from owner to addr1
		await expect(
			hardhatToken.transfer(addr1.address, 50)
		).to.changeTokenBalances(hardhatToken, [owner, addr1], [-50, 50]);

		// Transfer 50 tokens from addr1 to addr2
		// We use .connect(signer) to send a transaction from another account
		await expect(
			hardhatToken.connect(addr1).transfer(addr2.address, 50)
		).to.changeTokenBalances(hardhatToken, [addr1, addr2], [-50, 50]);
	});
});
