import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from 'hardhat/plugins';
import { IContractAddresses, NetworkName, NETWORK_NAMES } from './type-extensions';
import { Pool, PoolAddressesProvider, PoolAddressesProvider__factory, Pool__factory } from './typechain-types';

export class Aave{

    contractAddresses: IContractAddresses = {
        PoolAddressesProvider: ''
    }

    constructor(protected hre: HardhatRuntimeEnvironment){
        this.contractAddresses = this.getContractAddresses()
    }

    protected getNetworkName(): NetworkName{

        const networkName = this.hre.networkAlias.getNetworkName('aave-plugin') as NetworkName

        if (NETWORK_NAMES.includes(networkName))
            return networkName
        
        throw new HardhatPluginError(
            "hardhat-aave", 
            `The network name or alias (${networkName}) must be on of the following: ${NETWORK_NAMES}`
        )

    }

    protected getContractAddresses(): IContractAddresses {
        const { aave: { contractAddressByNetwork } } = this.hre.config
        const network = this.getNetworkName()
        return contractAddressByNetwork[network]
    }

    protected poolAddressesProvider: PoolAddressesProvider|undefined
    getPoolAddressesProvider(): PoolAddressesProvider{
        if (!this.poolAddressesProvider){
            this.poolAddressesProvider = PoolAddressesProvider__factory.connect(
                this.contractAddresses.PoolAddressesProvider, 
                this.hre.ethers.provider
            )
        }
        return this.poolAddressesProvider
    }
    
    protected pool: Pool|undefined
    async getPool(): Promise<Pool>{
        if (!this.pool){
            const poolAddress = await (this.getPoolAddressesProvider().getPool())
            this.pool = Pool__factory.connect(
                poolAddress, 
                this.hre.ethers.provider
            )    
        }
        return this.pool
    }
    
}

