"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Web3 = require("web3");
const common_enums_1 = require("./common-enums");
const rxjs_1 = require("rxjs");
let contracts = {
    Identity: require('./contracts/Identity'),
    DAVToken: require('./contracts/DAVToken'),
    BasicMission: require('./contracts/BasicMission'),
};
const REGISTRATION_REQUEST_HASH = new Web3().utils.sha3('DAV Identity Registration');
const TOKEN_AMOUNT = '1500000000000000000'; // TODO: TOKEN_AMOUNT need to be set by basicMission contract.
class Contracts {
    static initWeb3(config) {
        return new Web3(new Web3.providers.HttpProvider(config.ethNodeUrl));
    }
    static getContract(contractType, web3, config) {
        if (config.contracts) {
            contracts = config.contracts;
        }
        const abi = contracts[contractType].abi;
        const contractAddress = contracts[contractType].networks[config.blockchainType].address;
        const contract = new web3.eth.Contract(abi, contractAddress);
        return { abi, contractAddress, contract };
    }
    static sendSignedTransaction(web3, rawTransaction) {
        return new Promise((resolve, reject) => {
            const transaction = web3.eth.sendSignedTransaction(rawTransaction);
            transaction.once('receipt', receipt => {
                // tslint:disable-next-line:no-console
                console.log(`Transaction succeeded: ${JSON.stringify(receipt)}`);
                resolve(receipt);
            });
            transaction.once('transactionHash', hash => {
                // tslint:disable-next-line:no-console
                console.log(`Transaction sent: ${hash}`);
            });
            transaction.on('error', err => {
                // tslint:disable-next-line:no-console
                console.log(`Transaction failed: ${JSON.stringify(err)}`);
                reject(err);
            });
        });
    }
    static async checkContractPastEvents(contract /* , filterParam: string */) {
        // TODO: Filter getPastEvents by sellerId or by missionId.
        const event = await contract.getPastEvents('allEvents');
        return event;
    }
    static toSafeGasLimit(gasAmount) {
        return Math.min(gasAmount + 100, 4000000);
    }
    static calculatePrice(price) {
        return '150000000000000000';
    }
    static generateMissionId(config) {
        const web3 = Contracts.initWeb3(config);
        const { address } = web3.eth.accounts.create();
        return address;
    }
    static async isIdentityRegistered(davId, config) {
        const web3 = Contracts.initWeb3(config);
        const { contract } = Contracts.getContract(common_enums_1.ContractTypes.identity, web3, config);
        const receipt = await contract.methods.isRegistered(davId).call();
        return receipt;
    }
    static async registerIdentity(davId, identityPrivateKey, walletAddress, walletPrivateKey, config) {
        const isAlreadyRegistered = await Contracts.isIdentityRegistered(davId, config);
        if (isAlreadyRegistered) {
            return 'ALREADY_REGISTERED';
        }
        const web3 = Contracts.initWeb3(config);
        const { contract, contractAddress } = Contracts.getContract(common_enums_1.ContractTypes.identity, web3, config);
        const { sign } = web3.eth.accounts.privateKeyToAccount(identityPrivateKey);
        const { v, r, s } = sign(REGISTRATION_REQUEST_HASH);
        const { encodeABI, estimateGas } = await contract.methods.register(davId, v, r, s);
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: walletAddress,
            gas: Contracts.toSafeGasLimit(await estimateGas({ from: walletAddress })),
            gasPrice: await web3.eth.getGasPrice(),
        };
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey);
        const transactionReceipt = await Contracts.sendSignedTransaction(web3, rawTransaction);
        return transactionReceipt.transactionHash;
    }
    static async approveMission(davId, walletPrivateKey, config) {
        const web3 = Contracts.initWeb3(config);
        const { contract, contractAddress } = Contracts.getContract(common_enums_1.ContractTypes.davToken, web3, config);
        const missionContract = Contracts.getContract(common_enums_1.ContractTypes.basicMission, web3, config);
        const { encodeABI, estimateGas } = await contract.methods.approve(missionContract.contractAddress, TOKEN_AMOUNT);
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: davId,
            gas: Contracts.toSafeGasLimit(await estimateGas({ from: davId, to: contractAddress })),
            gasPrice: await web3.eth.getGasPrice(),
        };
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey);
        const transactionReceipt = await Contracts.sendSignedTransaction(web3, rawTransaction);
        return transactionReceipt;
    }
    static async startMission(missionId, davId, walletPrivateKey, vehicleId, price, config) {
        const fullPrice = Contracts.calculatePrice(price);
        const web3 = Contracts.initWeb3(config);
        const { contract, contractAddress } = Contracts.getContract(common_enums_1.ContractTypes.basicMission, web3, config);
        const { encodeABI, estimateGas } = await contract.methods.create(missionId, vehicleId, davId, TOKEN_AMOUNT);
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: davId,
            gas: Contracts.toSafeGasLimit(await estimateGas({ from: davId, to: contractAddress, value: fullPrice })),
            value: fullPrice,
            gasPrice: await web3.eth.getGasPrice(),
        };
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey);
        const transactionReceipt = await Contracts.sendSignedTransaction(web3, rawTransaction);
        return transactionReceipt;
    }
    static async finalizeMission(missionId, davId, walletPrivateKey, config) {
        const web3 = Contracts.initWeb3(config);
        const { contract, contractAddress } = Contracts.getContract(common_enums_1.ContractTypes.basicMission, web3, config);
        const { encodeABI, estimateGas } = await contract.methods.fulfilled(missionId);
        const tx = {
            data: encodeABI(),
            to: contractAddress,
            from: davId,
            gas: Contracts.toSafeGasLimit(await estimateGas({ from: davId })),
            gasPrice: await web3.eth.getGasPrice(),
        };
        const { rawTransaction } = await web3.eth.accounts.signTransaction(tx, walletPrivateKey);
        const transactionReceipt = await Contracts.sendSignedTransaction(web3, rawTransaction);
        return transactionReceipt;
    }
    static watchContract(davId, contractType, config) {
        const web3 = Contracts.initWeb3(config);
        const { contract } = Contracts.getContract(contractType, web3, config);
        let lastBlock = 0;
        let lastTransactionIndex = 0;
        const events = rxjs_1.Observable.interval(2000)
            .map(() => Contracts.checkContractPastEvents(contract /* , davId */))
            .map(promise => rxjs_1.Observable.fromPromise(promise))
            .map(eventsObservable => eventsObservable.mergeAll())
            .map(eventsArray => rxjs_1.Observable.from(eventsArray))
            .mergeAll()
            .filter(event => event.blockNumber > lastBlock || (event.blockNumber === lastBlock && event.transactionIndex > lastTransactionIndex))
            .do(event => {
            lastBlock = event.blockNumber;
            lastTransactionIndex = event.transactionIndex;
        });
        return events;
    }
}
exports.default = Contracts;

//# sourceMappingURL=Contracts.js.map
