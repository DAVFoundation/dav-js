import IConfig from './IConfig';
import Web3 = require('web3');
import { DavID, Observable } from './common-types';

const DAV_REGISTRATION_REQUEST = 'DAV Identity Registration';
const contracts = {
    // TODO: contracts path should be in same dir.... build is for build results - this code will not work after compilation
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
        const receipt = await contract.methods.isRegistered(davID).call();
        return receipt;
    }

    public static async registerIdentity(davId: DavID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string, config: IConfig):
     Promise<boolean> {
        const isAlreadyRegistered = await this.isIdentityRegistered(davId, config);
        if (isAlreadyRegistered) {
            return true;
        }
        const web3 = new Web3(new Web3.providers.HttpProvider(config.ethNodeUrl));
        const abi = contracts.identity.abi;
        const address = this.getContractAddress(contracts.identity, config);
        const signature = web3.eth.accounts.sign(DAV_REGISTRATION_REQUEST, identityPrivateKey) as any;
        console.log(1);
        const contract = new web3.eth.Contract(abi, address);
        console.log(2);
        const receipt = await contract.methods.register(davId, signature.v, signature.r, signature.s).send({ from: walletAddress });
        console.log(3);
        web3.eth.accounts.signTransaction(receipt, walletPrivateKey);

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
        // TODO: How does this support local test network?
        return contract.networks[config.blockchainType].address;
    }
}
