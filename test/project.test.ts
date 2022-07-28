// tslint:disable-next-line no-implicit-dependencies
import { assert } from "chai";

import { useEnvironment } from "./helpers";

describe("Integration tests examples", function () {

    const { Aave } = require("../src/aave")

    describe("Hardhat Runtime Environment extension", function () {
        useEnvironment("hardhat-project");

        it("Should add the external field", function () {
            assert.instanceOf(
                this.hre.aave,
                Aave
            );
        });

    });

    describe("HardhatConfig extension", function () {
        useEnvironment("hardhat-project");

        it("Should be possible to get an instance of PoolAddressesProvider contract.", function () {

            const poolAddressProvider = this.hre.aave.getPoolAddressesProvider()

            assert.equal(
                poolAddressProvider.address,
                this.hre.config.aave.contractAddressByNetwork["avalanche-mainnet"].PoolAddressesProvider
            );

        });


        it("Should be possible to get an instance of Pool contract.", async function () {

            const AVALANCHE_NODE_URL = "https://api.avax.network/ext/bc/C/rpc";
            const FORK_BLOCKNUMBER = 17628728

            await this.hre.ethers.provider.send(
                "hardhat_reset",
                [
                    {
                        forking: {
                            jsonRpcUrl: AVALANCHE_NODE_URL,
                            blockNumber: FORK_BLOCKNUMBER,
                        },
                    },
                ],
            );    

            const pool = await this.hre.aave.getPool()

            const poolAddressProvider = this.hre.aave.getPoolAddressesProvider()

            assert.equal(
                pool.address,
                await poolAddressProvider.getPool()
            );

        });

    });
});
