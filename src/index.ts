import '@sebasgoldberg/hardhat-network-alias'
import "@nomiclabs/hardhat-ethers";

import { extendConfig, extendEnvironment } from "hardhat/config";
import { lazyObject } from "hardhat/plugins";
import { HardhatConfig, HardhatUserConfig } from "hardhat/types";
import { NetworkName } from './type-extensions';

// This import is needed to let the TypeScript compiler know that it should include your type
// extensions in your npm package's types file.
import "./type-extensions";

export const AVALANCHE_MAINNET_NETWORK: NetworkName = 'avalanche-mainnet'
export const CUSTOM_NETWORK: NetworkName = 'custom-network'

extendConfig(
  (config: HardhatConfig, userConfig: Readonly<HardhatUserConfig>) => {
    // We apply our default config here. Any other kind of config resolution
    // or normalization should be placed here.
    //
    // `config` is the resolved config, which will be used during runtime and
    // you should modify.
    // `userConfig` is the config as provided by the user. You should not modify
    // it.
    //
    // If you extended the `HardhatConfig` type, you need to make sure that
    // executing this function ensures that the `config` object is in a valid
    // state for its type, including its extensions. For example, you may
    // need to apply a default value, like in this example.

    config.aave = {
        ... {
            contractAddressByNetwork: {
                [AVALANCHE_MAINNET_NETWORK]: {
                    PoolAddressesProvider: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
                    UiPoolDataProviderV3: '0xdBbFaFC45983B4659E368a3025b81f69Ab6E5093',
                },
                [CUSTOM_NETWORK]: {
                  PoolAddressesProvider: '',
                  UiPoolDataProviderV3: '',
              }
            },
        },
        ...userConfig.aave || {},
    }

  }
);

extendEnvironment((hre) => {
  // We add a field to the Hardhat Runtime Environment here.
  // We use lazyObject to avoid initializing things until they are actually
  // needed.
  hre.aave = lazyObject(() => {
    // We do not import the "./aave" module using `import` because
    // "./aave" depends on "./typechain-types" that are generated using
    // the task `npx hardhat typechains`, then we have a circular dependency
    // that will generate syntax and runtime exceptions in case of
    // importing this module in the global scope.
    const { Aave } = require("./aave")
    return new Aave(hre)
  });
});

