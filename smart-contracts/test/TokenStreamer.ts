import {
    time,
    loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";
import { describe } from "node:test";

describe("TokenStreamer", function () {
    // We define a fixture to reuse the same setup in every test.
    // We use loadFixture to run this setup once, snapshot that state,
    // and reset Hardhat Network to that snapshot in every test.
    async function deployTokenStreamerFixture() {
        const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60;
        const TEN_DAYS_IN_SECS = 10 * 24 * 60 * 60;
        const ONE_GWEI = 1_000_000_000;
        const USDC_DECIMALS = 1_000_000;


        const lockedAmount = ONE_GWEI;
        const newTime = (await time.latest()) + TEN_DAYS_IN_SECS;

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await hre.ethers.getSigners();

        const TokenStreamer = await hre.ethers.getContractFactory("TokenStreamer");
        const MockUsdc = await hre.ethers.getContractFactory("MockUsdc");
        const tokenStreamer = await TokenStreamer.deploy(owner);
        const mockUsdc = await MockUsdc.deploy(1000000);

        return { tokenStreamer, mockUsdc, newTime, lockedAmount, owner, otherAccount };
    }

    describe("Deployment", function () {

        it("Should set the right owner", async function () {
            const { tokenStreamer, owner, otherAccount } = await loadFixture(deployTokenStreamerFixture);

            expect(await tokenStreamer.owner()).to.equal(owner.address);
        });

    });

    describe("Streams", function () {

        it("Should create streams", async function () {
            const { tokenStreamer, owner, otherAccount, mockUsdc } = await loadFixture(deployTokenStreamerFixture);
            const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
            const totalAmountToStream = 30 * 1000000;
            const rate = Math.ceil(totalAmountToStream / ONE_MONTH_IN_SECS);

            // const calculatedAmount = rate * ONE_MONTH_IN_SECS
            // const remainingAmount = totalAmountToStream - calculatedAmount
            // const modulo = remainingAmount % rate;
            // const notimes = Math.floor(remainingAmount / rate);
            // console.log("rate:", rate);
            // console.log("remaining amount:", remainingAmount);
            // console.log("no of times:", notimes)
            // console.log("modulo:", modulo);
            // console.log("calculated amount:", calculatedAmount);

            //     expect(await tokenStreamer.createStream(otherAccount, mockUsdc, rate, ONE_MONTH_IN_SECS)).to.equal(owner.address);
            //   });


            // Approve the TokenStreamer contract to spend the USDC tokens
            await mockUsdc.connect(owner).approve(tokenStreamer.getAddress(), totalAmountToStream);

            // Optional: Assert the allowance using mockUSDC's allowance function (if available)
            const allowance = await mockUsdc.allowance(owner.address, tokenStreamer.getAddress());
            expect(allowance).to.equal(totalAmountToStream);

            //Create the stream
            const tx = await tokenStreamer.createStream(otherAccount.address, mockUsdc.getAddress(), rate, ONE_MONTH_IN_SECS, totalAmountToStream);
            const receipt = await tx.wait();

            // Check if the token transfer was successful
            const tokenStreamerBalance = await mockUsdc.balanceOf(tokenStreamer.getAddress());
            expect(tokenStreamerBalance).to.equal(totalAmountToStream);

            // // Check if the stream data was stored correctly
            // const streamId = streamCreatedEvent.args.streamId;
            // const stream = await tokenStreamer.streams(streamId);
            // expect(stream.sender).to.equal(owner.address);
            // expect(stream.receiver).to.equal(otherAccount.address);
            // expect(stream.token).to.equal(mockUsdc.address);
            // expect(stream.rate).to.equal(rate);
            // expect(stream.startTime).to.be.closeTo(Math.floor(Date.now() / 1000), 5); // Allow for a small time difference
            // expect(stream.endTime).to.equal(stream.startTime + BigInt(ONE_MONTH_IN_SECS));
            // expect(stream.withdrawnAmount).to.equal(0);
        });

        it("should set the receiver correctly", async function () {
            const { tokenStreamer, owner, otherAccount, mockUsdc } = await loadFixture(deployTokenStreamerFixture);
            const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
            const totalAmountToStream = 30 * 1000000;
            const rate = Math.round(totalAmountToStream / ONE_MONTH_IN_SECS);

            // Approve the TokenStreamer contract to spend the USDC tokens
            await mockUsdc.connect(owner).approve(tokenStreamer.getAddress(), totalAmountToStream);

            // Optional: Assert the allowance using mockUSDC's allowance function (if available)
            const allowance = await mockUsdc.allowance(owner.address, tokenStreamer.getAddress());
            expect(allowance).to.equal(totalAmountToStream);

            //Create the stream
            const tx = await tokenStreamer.createStream(otherAccount.address, mockUsdc.getAddress(), rate, ONE_MONTH_IN_SECS, totalAmountToStream);
            const receipt = await tx.wait();

            const stream = await tokenStreamer.getStreamDetails(1);
            const receiver = stream.receiver;
            expect(receiver).to.eq(otherAccount)

        })

    });

    describe("Withdrawals", function () {
        it("Should allow the receiver to withdraw streams", async function () {
            const { tokenStreamer, newTime, owner, otherAccount, mockUsdc } = await loadFixture(deployTokenStreamerFixture);
            const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
            const totalAmountToStream = 30 * 1000000;
            const rate = Math.round(totalAmountToStream / ONE_MONTH_IN_SECS);

            // Approve the TokenStreamer contract to spend the USDC tokens
            await mockUsdc.connect(owner).approve(tokenStreamer.getAddress(), totalAmountToStream);

            //Create the stream
            const tx = await tokenStreamer.createStream(otherAccount.address, mockUsdc.getAddress(), rate, ONE_MONTH_IN_SECS, totalAmountToStream);
            await tx.wait();

            await time.increaseTo(newTime);

            //     const tx2 = await tokenStreamer.connect(otherAccount).withdrawFromStream(1);
            //     await tx2.wait();

            //     // Check if the token transfer was successful
            //     const receiverStreamedBalance = await mockUsdc.balanceOf(otherAccount.address);
            //     console.log("tokenStreamer balance: ", receiverStreamedBalance)

            await expect(tokenStreamer.connect(otherAccount).withdrawFromStream(1)).to.changeTokenBalance(mockUsdc,
                otherAccount,
                10367964
            );

        })

        it("should allow the stream creator to withdraw remaining funds", async function() {

            const { tokenStreamer, newTime, owner, otherAccount, mockUsdc } = await loadFixture(deployTokenStreamerFixture);
            const ONE_MONTH_IN_SECS = 30 * 24 * 60 * 60;
            const totalAmountToStream = 30 * 1000000;
            const rate = Math.round(totalAmountToStream / ONE_MONTH_IN_SECS);

            // Approve the TokenStreamer contract to spend the USDC tokens
            await mockUsdc.connect(owner).approve(tokenStreamer.getAddress(), totalAmountToStream);

            //Create the stream
            const tx = await tokenStreamer.createStream(otherAccount.address, mockUsdc.getAddress(), rate, ONE_MONTH_IN_SECS, totalAmountToStream);
            await tx.wait();

            await time.increaseTo(newTime);

            const tx2 = await tokenStreamer.connect(otherAccount).withdrawFromStream(1);
            await tx2.wait();

            const expectedAmt = 30000000 - 10367964

            await expect(tokenStreamer.connect(owner).cancelStream(1)).to.changeTokenBalance(mockUsdc,
                owner,
                expectedAmt
            );

            const withdrawnBalance = await mockUsdc.balanceOf(owner.address);
            console.log("balance: ", withdrawnBalance)


        })
    })




});
