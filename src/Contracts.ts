import IConfig from './IConfig';
import { DavID, BigInteger, ID, Observable } from './common-types';
import Web3 = require('web3');
import { contracts } from './common-enums';

// TODO: remove unnecessary comments
// web3.utils.sha3('DAV Identity Registration'):
const REGISTRATION_REQUEST_HASH = '0x3d75604157f80934d3965cbdf5676395ddaf5f92b8d7c90caf745f93d35d2066';
const TOKEN_AMOUNT = '1500000000000000000';

export default class Contracts {

    private static initWeb3(config: IConfig): Web3 {
        return new Web3(new Web3.providers.HttpProvider(config.ethNodeUrl));
    }

    // TODO: create interface and use as return type
    private static getContract(contractType: contracts, web3: Web3, config: IConfig): any {
        // TODO: use `${...} ${...}` string formatter instead of '+' operator
        // TODO: don't use dynamic require (will fail after webpack) - statically require all and use a dynamic map.
        const contractFile = require(config.contractPath + contractType);
        const abi = contractFile.abi;
        const contractAddress = contractFile.networks[config.blockchainType].address;
        const contract = new web3.eth.Contract(abi, contractAddress);
        return { abi, contractAddress, contract };
    }
    // TODO: change return: any -> TransactionReceipt
    private static sendSignedTransaction(web3: Web3, rawTransaction: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const transaction = web3.eth.sendSignedTransaction(rawTransaction);
            transaction.once('receipt', (receipt) => resolve(receipt));
            transaction.on('error', (err) => reject(err));
        });
    }

    // TODO: don't use 'any' for params and return
    private static async checkContractPastEvents(contract: any, filter: string): Promise<any[]> {
        // ToDo: Filter getPastEvents by sellerId or by missionId.
        const event = await contract.getPastEvents('allEvents');
        return event;
    }

    private static toSafeGasLimit(gasAmount: number) {
        return Math.min(gasAmount + 100, 4000000);
    }

    // TODO: davID -> davId
    // TODO: where ever you use 'this' for static calls change to class name
    public static async isIdentityRegistered(davID: DavID, config: IConfig): Promise<boolean> {
        const web3 = this.initWeb3(config);
        const { contract } = this.getContract(contracts.identity, web3, config);
        const receipt = await contract.methods.isRegistered(davID).call();
        return receipt;
    }

    // TODO: wrong line cutoff point - prefer in middle of param list
    public static async registerIdentity(davId: DavID, identityPrivateKey: string, walletAddress: string, walletPrivateKey: string, config: IConfig):
        Promise<string> {
        const isAlreadyRegistered = await this.isIdentityRegistered(davId, config);
        if (isAlreadyRegistered) {
            return 'ALREADY_REGISTERED';
        }
        const web3 = this.initWeb3(config);
        const { contract, contractAddress } = this.getContract(contracts.identity, web3, config);
        // TODO: 'any' -> real type
        const { sign } = web3.eth.accounts.privateKeyToAccount(identityPrivateKey) as any;
        // TODO: 'any' -> real type
        const { v, r, s } = sign(REGISTRATION_REQUEST_HASH) as any;
        // TODO: 'any' -> real type
        const { encodeABI, estimateGas } = await contract.methods.register(davId, v, r, s) as any;
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: walletAddress,
            gas: this.toSafeGasLimit(await estimateGas({ from: walletAddress })),
        };
        // TODO: 'any' -> real type
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey) as any;
        const transactionHash = await this.sendSignedTransaction(web3, rawTransaction);
        return transactionHash;
    }

    // TODO: wrong line cutoff point - prefer in middle of param list
    public static async approveMission(davId: DavID, walletPrivateKey: string, config: IConfig):
    Promise<string> {
        const web3 = this.initWeb3(config);
        const { contract, contractAddress } = this.getContract(contracts.davToken, web3, config);
        const missionContract = this.getContract(contracts.basicMission, web3, config);
        const { encodeABI, estimateGas } = await contract.methods.approve(missionContract.contractAddress, TOKEN_AMOUNT);
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: davId,
            gas: this.toSafeGasLimit(await estimateGas({ from: davId, to: contractAddress })),
        };
        // TODO: 'any' -> real type
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey) as any;
        const transactionHash = await this.sendSignedTransaction(web3, rawTransaction);
        return transactionHash;
    }

    // TODO: wrong line cutoff point - prefer in middle of param list
    public static async startMission(missionId: ID, davId: DavID, walletPrivateKey: string, vehicleId: DavID, price: BigInteger, config: IConfig):
    Promise<string> {
        const web3 = this.initWeb3(config);
        const { contract, contractAddress } = this.getContract(contracts.basicMission, web3, config);
        const { encodeABI, estimateGas } = await contract.methods.create(missionId, vehicleId, davId, TOKEN_AMOUNT);
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: davId,
            gas: this.toSafeGasLimit(await estimateGas({ from: davId, to: contractAddress, value: price })),
            value: price,
        };
        // TODO: 'any' -> real type
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey) as any;
        const transactionHash = await this.sendSignedTransaction(web3, rawTransaction);
        return transactionHash;
    }

    public static async finalizeMission(missionId: ID, davId: DavID, walletPrivateKey: string, config: IConfig): Promise<void> {
        const web3 = this.initWeb3(config);
        const { contract, contractAddress } = this.getContract(contracts.basicMission, web3, config);
        const { encodeABI, estimateGas } = await contract.methods.fulfilled(missionId) as any;
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: davId,
            gas: this.toSafeGasLimit(await estimateGas({ from: davId })),
        };
        // TODO: 'any' -> real type
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey) as any;
        const transactionHash = await this.sendSignedTransaction(web3, rawTransaction);
        return transactionHash;
    }

    public static watchContract(davId: string, contractType: contracts, config: IConfig): Observable<any> {
        const web3 = this.initWeb3(config);
        const { contract } = this.getContract(contractType, web3, config);
        const oldEventsTransactionHash: {[key: string]: boolean} = {};
        // TODO: 'any' -> real type (i.e. Observer<TYPE>)
        // TODO: no need to build an Observable by using another Observable....just use the internal with map/filter etc...
        const observable = Observable.create((observer: any) => {
            Observable.interval(2000).subscribe( async () => {
                try {
                    let events = await this.checkContractPastEvents(contract, davId);
                    events = events.filter((event: any) => !oldEventsTransactionHash[event.transactionHash]);
                    events.forEach((event: any) => oldEventsTransactionHash[event.transactionHash] = true);
                    if (events.length) {
                        observer.next(events);
                    }
                } catch (err) {
                    observer.error(err);
                }
            });
        });
        return observable;
    }
}
