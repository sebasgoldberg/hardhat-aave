import { HardhatUserConfig } from "hardhat/config"
import '@typechain/hardhat'
import "./src/index"

/**
 * - Deveria soportar solo la incorporación de modelos.
 * - Las direcciones de los contratos deverian definirse en un 
 *   modulo siguiendo un interface especifica.
 * - La creacion de las instancias deveria hacerse con una función 
 *   definida usando un template type, pasando el <Modelo>__factory
 *   como parametro y la direccion de contrato. Dicha función retornaría
 *   el tipo de retorno de <Modelo>__factory.
 */
import "@sebasgoldberg/hardhat-network-alias"
import { AVALANCHE_MAINNET_NETWORK } from "./src/index"


const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networkAliases: {
    "aave-plugin": {
      'localhost': AVALANCHE_MAINNET_NETWORK,
      'hardhat': AVALANCHE_MAINNET_NETWORK,
    }
  },
  typechain: {
    externalArtifacts: [
      'node_modules/@aave/core-v3/artifacts/contracts/protocol/configuration/PoolAddressesProvider.sol/PoolAddressesProvider.json',
      'node_modules/@aave/core-v3/artifacts/contracts/protocol/pool/Pool.sol/Pool.json',
    ],
    outDir: 'src/typechain-types',
  },
};

export default config;
