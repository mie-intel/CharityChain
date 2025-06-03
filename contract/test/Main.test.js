const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Main Contract", function () {
  let Main, main;
  let owner, addr1;

  beforeEach(async function () {
    [owner, addr1] = await ethers.getSigners();
    Main = await ethers.getContractFactory("Main");
    main = await Main.deploy();
  });

  it("Should create a user", async function () {
    await main.createUser("user1", 100);
    const user = await main.getUser("user1");
    expect(user.userId).to.equal("user1");
    expect(user.balance).to.equal(100);
  });

  it("Should create a campaign", async function () {
    await main.createUser("user1", 100);
    await main.connect(addr1).createCampaign(
      "user1",
      "Test Campaign",
      86400, // 1 day in seconds
      1000,
      0
    );
    const campaign = await main.getCampaign(1);
    expect(campaign.title).to.equal("Test Campaign");
  });
});
