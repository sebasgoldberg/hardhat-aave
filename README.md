# hardhat-aave-plugin

This plug-in it is used to encapsulate operations with the AAVE protocol.

[Hardhat](https://hardhat.org) AAVE plugin. 

## What

This plugin will help you with:
- The AAVE contract interaction, suppling type information based in constracts abis.
- Simplified interaction with the protocol for all supported networks using hardhat-network-alias.
- For each model it is possible to generate typechain classes.

## Installation

```bash
npm install @sebasgoldberg/hardhat-aave
```

Import the plugin in your `hardhat.config.js`:

```js
require("@sebasgoldberg/hardhat-aave");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "@sebasgoldberg/hardhat-aave";
```

## Tasks

There are no tasks for this plugin.

## Environment extensions

This plugin extends the Hardhat Runtime Environment by adding an `aave` field
whose type is `AAVE`.

Here is a simple usage example to get the AAVE Pool contract for the selected network:

``` typescript
// ...
const pool = await this.hre.aave.getPool()
// ...
```

Note that `pool` has the type `Pool` generated using [typechains](https://github.com/dethcrypto/TypeChain).

## Configuration

### Network Aliases

You must configure the `hre.config.networkAliases` key, adding the "aave-plugin" group, 
and for this group especify for each of your project networks, wich of the 
hardhat-aave-plugin predifined networks should be mapped.

This is necessary to know wich AAVE's contract addresses should be used for each one of
your hardhat project networks.

Here is an example of the configuration:

``` typescript
import { AVALANCHE_MAINNET_NETWORK } from "@sebasgoldberg/hardhat-aave";
// ...

const config: HardhatUserConfig = {
  //...
  networkAliases: {
    "aave-plugin": {
      'localhost': AVALANCHE_MAINNET_NETWORK,
      'mainnet': AVALANCHE_MAINNET_NETWORK,
    }
  },
  //...
};
// ...
```

In the example above we are telling that 'mainnet' and 'localhost' networks
configured in the hardhat project, should use the Avalanche Mainnet contract addresses.

### Custom Network and Address Redefinitions

In case you need to redefine a contract address for a specific network, you can do this
using the `hre.config.aave.contractAddressByNetwork`.

You can also define addresses for your own network using the `CUSTOM_NETWORK` key.

Here is an example (including networkAliases):

``` typescript
import { AVALANCHE_MAINNET_NETWORK, CUSTOM_NETWORK } from "@sebasgoldberg/hardhat-aave";
// ...

const config: HardhatUserConfig = {
  //...
  aave: {
    contractAddressByNetwork: {
      [AVALANCHE_MAINNET_NETWORK]: {
        PoolAddressesProvider: '0x0123456789012345678901234567890123456789'
      },
      [CUSTOM_NETWORK]: {
        PoolAddressesProvider: '0xABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD'
      }
    },
  },
  //...
  networkAliases: {
    "aave-plugin": {
      'hardhat': CUSTOM_NETWORK
      'localhost': AVALANCHE_MAINNET_NETWORK,
      'mainnet': AVALANCHE_MAINNET_NETWORK,
    }
  },
  //...
};
// ...
```
