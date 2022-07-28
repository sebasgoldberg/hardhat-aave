// We load the plugin here.
import { HardhatUserConfig } from "hardhat/types";
import { AVALANCHE_MAINNET_NETWORK } from "../../../src";

import "../../../src/index";

const config: HardhatUserConfig = {
  solidity: "0.7.3",
  defaultNetwork: "hardhat",
  networkAliases: {
    "aave-plugin": {
      'localhost': AVALANCHE_MAINNET_NETWORK,
      'hardhat': AVALANCHE_MAINNET_NETWORK,
    }
  },
};

export default config;
