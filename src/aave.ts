import { HardhatRuntimeEnvironment } from "hardhat/types";
import { HardhatPluginError } from 'hardhat/plugins';
import { IContractAddresses, NetworkName, NETWORK_NAMES } from './type-extensions';
import { AaveOracle, AaveOracle__factory, AToken, AToken__factory, Pool, PoolAddressesProvider, PoolAddressesProvider__factory, Pool__factory, StableDebtToken, StableDebtToken__factory, UiPoolDataProviderV3, UiPoolDataProviderV3__factory, VariableDebtToken, VariableDebtToken__factory } from './typechain-types';

export type InterestRateMode = 1 | 2

export const constants = {
    interestRateMode: {
        Stable: 1 as InterestRateMode,
        Variable: 2 as InterestRateMode
    },
    baseDecimalPrecision: 8
}

export class Aave{

    contractAddresses: IContractAddresses = {
        PoolAddressesProvider: '',
        UiPoolDataProviderV3: '',
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
                this.hre.getProvider()
            )
        }
        return this.poolAddressesProvider
    }
    
    protected aaveOracle: AaveOracle|undefined
    async getAaveOracle(): Promise<AaveOracle>{
        if (!this.aaveOracle){
            this.aaveOracle = AaveOracle__factory.connect(
                await this.getPoolAddressesProvider().getPriceOracle(), 
                this.hre.getProvider()
            )
        }
        return this.aaveOracle
    }
    
    protected uiPoolDataProviderV3: UiPoolDataProviderV3|undefined
    getUiPoolDataProviderV3(): UiPoolDataProviderV3{
        if (!this.uiPoolDataProviderV3){
            this.uiPoolDataProviderV3 = UiPoolDataProviderV3__factory.connect(
                this.contractAddresses.UiPoolDataProviderV3, 
                this.hre.getProvider()
            )
        }
        return this.uiPoolDataProviderV3
    }
    
    protected pool: Pool|undefined
    async getPool(): Promise<Pool>{
        if (!this.pool){
            const poolAddress = await (this.getPoolAddressesProvider().getPool())
            this.pool = Pool__factory.connect(
                poolAddress, 
                this.hre.getProvider()
            )    
        }
        return this.pool
    }

    async getReserveTokens(asset: string): Promise<IReservesTokens>{

        const pool = await this.getPool()
        const { aTokenAddress, variableDebtTokenAddress, stableDebtTokenAddress } = await pool.getReserveData(asset)
        return {
            aToken: AToken__factory.connect(aTokenAddress, this.hre.getProvider()),
            variableDebtToken: VariableDebtToken__factory.connect(variableDebtTokenAddress, this.hre.getProvider()),
            stableDebtToken: StableDebtToken__factory.connect(stableDebtTokenAddress, this.hre.getProvider())
        }
    }
}

export interface IReservesTokens {
    aToken: AToken,
    variableDebtToken: VariableDebtToken
    stableDebtToken: StableDebtToken
}