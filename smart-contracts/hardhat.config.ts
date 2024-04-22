import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.24",
  // ignition: {
  //   blockPollingInterval: 1_000,
  //   timeBeforeBumpingFees: 3 * 60 * 1_000,
  //   maxFeeBumps: 4,
  //   requiredConfirmations: 5,
  // },
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    filecoinCalibrationNet: {
      url: "https://filecoin-calibration.chainstacklabs.com/rpc/v1",
      chainId: 314159,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    etherlinkTestnet: {
      url: "https://node.ghostnet.etherlink.com/",
      chainId: 128123,
      accounts: [`${process.env.PRIVATE_KEY}`],
    },
    sphinx: {
      url: "https://sphinx.shardeum.org/",
      chainId: 8082,
      accounts: [`${process.env.PRIVATE_KEY}`],
    }
  } 
};

export default config;
