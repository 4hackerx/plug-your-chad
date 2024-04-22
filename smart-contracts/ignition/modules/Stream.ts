import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JAN_1ST_2030 = 1893456000;
const ONE_GWEI: bigint = 1_000_000_000n;

const TokenStreamerModule = buildModule("TokenStreamerModule", (m) => {
  //const unlockTime = m.getParameter("unlockTime", JAN_1ST_2030);
  //const lockedAmount = m.getParameter("lockedAmount", ONE_GWEI);
  const owner = ""

  const tokenStreamer = m.contract("TokenStreamer", [owner]);

  return { tokenStreamer };
});

export default TokenStreamerModule;



// import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

// export default buildModule("Apollo", (m) => {
//   const apollo = m.contract("Rocket", ["Saturn V"]);

//   m.call(apollo, "launch", []);

//   return { apollo };
// });