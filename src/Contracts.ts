import IConfig from './IConfig';
import Web3 = require('web3');
import { DavID, Observable } from './common-types';

const contracts = {
    identity: require('../build/contracts/Identity'),
    davToken: require('../build/contracts/DAVToken'),
    basicMission: require('../build/contracts/BasicMission'),
};

export default class Contracts {

    public static async isIdentityRegistered(davID: DavID, config: IConfig): Promise<boolean> {
        const web3 = new Web3(new Web3.providers.HttpProvider(config.ethNodeUrl));
        const abi = contracts.identity.abi;
        const address = this.getContractAddress(contracts.identity, config);
        const contract = new web3.eth.Contract(abi, address);
        const receipt = await contract.methods.isRegistered(davID).call({from: davID});
        return receipt;
    }

    public static async registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string, config: IConfig):
     Promise<void> {
        /**/
    }

    public static async finalizeMission(walletPrivateKey: string, config: IConfig): Promise<void> {
        /**/
    }

    public static async signContract(walletPrivateKey: string, config: IConfig): Promise<void> {
        /**/
    }

    public static watchContract(contratHash: string, config: IConfig)/*: Observable<>*/ {
        /**/
    }

    private static getContractAddress(contract: any, config: IConfig): string {
        return contract.networks[config.blockchainType].address;
    }
}
