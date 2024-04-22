import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import hre from "hardhat";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;


const TokenStreamerModules = buildModule("TokenStreamerModule", (m) => {
  //const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  //const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);


  const tokenStreamer = m.contract("TokenStreamer", ["0x5e869af2Af006B538f9c6D231C31DE7cDB4153be"]);

  return { tokenStreamer };
});

export default TokenStreamerModules;



// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// export default buildModule("Apollo", (m) => {
//   const apollo = m.contract("Rocket", ["Saturn V"]);

//   m.call(apollo, "launch", []);

//   return { apollo };
// });