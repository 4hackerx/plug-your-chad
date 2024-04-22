require('dotenv').config()
import { deployContract } from "@nomicfoundation/hardhat-ethers/types";
import { ethers, run, network } from "hardhat";

async function main() {
   let address = await deployStreamContract("0x5e869af2Af006B538f9c6D231C31DE7cDB4153be");
   console.log("---- Token Streamer Contract was deployed to: ---- ", address);
}

async function deployStreamContract(owner: any) {
    console.log("Deploying Token streamer contract")
    const TokenStreamerFactory = await ethers.getContractFactory("TokenStreamer");
    const tokenStreamer = await TokenStreamerFactory.deploy(owner);
    let result = await tokenStreamer.waitForDeployment();
    //console.log("---- Token Streamer Contract was deployed to: ---- ", result.getAddress());
    return result.getAddress();
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
