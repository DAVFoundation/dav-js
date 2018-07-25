import IConfig from './IConfig';
import { DavID } from './common-types';
import Web3 = require('web3');

const toSafeGasAmount = (gasAmount: number) => Math.min(gasAmount * 2, 1000000);
// web3.utils.sha3('DAV Identity Registration'):
const REGISTRATION_REQUEST_HASH = '0x3d75604157f80934d3965cbdf5676395ddaf5f92b8d7c90caf745f93d35d2066';
const contracts = {
    identity: require('./contracts/Identity'),
    davToken: require('./contracts/DAVToken'),
    basicMission: require('./contracts/BasicMission'),
};

export default class Contracts {

    public static async isIdentityRegistered(davID: DavID, config: IConfig): Promise<boolean> {
        const { contract } = this.initWeb3(contracts.identity, config);
        const receipt = await contract.methods.isRegistered(davID).call();
        return receipt;
    }

    public static async registerIdentity(davId: DavID, identityPrivateKey: string, walletAddress: string, walletPrivateKey: string, config: IConfig):
    Promise<string> {
        const isAlreadyRegistered = await this.isIdentityRegistered(davId, config);
        if (isAlreadyRegistered) {
            return 'ALREADY_REGISTERED';
        }
        const { contract, web3, contractAddress } = this.initWeb3(contracts.identity, config);
        const { sign } = web3.eth.accounts.privateKeyToAccount(identityPrivateKey) as any;
        const { v, r, s } = sign(REGISTRATION_REQUEST_HASH) as any;
        const { encodeABI, estimateGas } = await contract.methods.register(davId, v, r, s) as any;
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: walletAddress,
            gas: toSafeGasAmount(await estimateGas({ from: walletAddress })),
        };
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey) as any;
        const transactionHash = await this.sendSignedTransaction(web3, rawTransaction);
        return transactionHash;
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

    private static initWeb3(contractFile: any, config: IConfig): any {
        const web3 = new Web3(new Web3.providers.HttpProvider(config.ethNodeUrl));
        const abi = contractFile.abi;
        const contractAddress = contractFile.networks[config.blockchainType].address;
        const contract = new web3.eth.Contract(abi, contractAddress);
        return { web3, abi, contractAddress, contract };
    }

    private static sendSignedTransaction(web3: Web3, rawTransaction: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const transaction = web3.eth.sendSignedTransaction(rawTransaction);
            transaction.once('transactionHash', (hash) => resolve(hash));
            transaction.on('error', (err) => reject(err));
        });
    }
}
