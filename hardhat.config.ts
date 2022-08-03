import { HardhatUserConfig } from "hardhat/config"
import "@sebasgoldberg/hardhat-network-alias"
import "@sebasgoldberg/hardhat-external";
import '@typechain/hardhat'



const config: HardhatUserConfig = {
  solidity: "0.8.9",
  external:{
    path: 'src/external-plugin'
  },
  typechain: {
    outDir: 'src/typechain-types',
  },
};

export default config;
