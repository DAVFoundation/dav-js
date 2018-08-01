// tslint:disable:max-classes-per-file

class HttpProvider {
}

class Accounts {
    public static privateKeyToAccount() {
        return { sign: () => ({v: 'v', r: 'r', s: 's'}) };
    }
    public static signTransaction() {
        return { rawTransaction: 'RAW_TRANSACTION' };
    }
}

function sendSignedTransaction(callRes: any) {
    return () => ({
        once: (type: string, cb: any) => jest.fn(callRes.sendSignedTransactionSuccess(type, cb)),
        on:  (type: string, cb: any) => jest.fn(callRes.sendSignedTransactionError(type, cb)),
    });
}

function contractFactory(callRes: any) {
    class Contract {
        public getPastEvents = callRes.getPastEvents;
        public methods: any;
        constructor() {
            this.methods = {
                isRegistered: jest.fn(() => ({
                    call: jest.fn(() => Promise.resolve(callRes.isRegistered)),
                })),
                register: jest.fn(() => ({
                    encodeABI: jest.fn(() => 'encodeABI'),
                    estimateGas: jest.fn(() => 100),
                    send: jest.fn(() => Promise.resolve(callRes.register)),
                })),
                approve: jest.fn(() => ({
                    encodeABI: jest.fn(() => 'encodeABI'),
                    estimateGas: jest.fn(() => 100),
                })),
                create: jest.fn(() => ({
                    encodeABI: jest.fn(() => 'encodeABI'),
                    estimateGas: jest.fn(() => 100),
                })),
                fulfilled: jest.fn(() => ({
                    encodeABI: jest.fn(() => 'encodeABI'),
                    estimateGas: jest.fn(() => 100),
                })),
            };
        }
    }
    return Contract;
}

function web3Factory(callRes: any) {
    class Web3 {
        public static providers = { HttpProvider };
        public eth = {
            Contract: contractFactory(callRes),
            accounts: Accounts,
            sendSignedTransaction: sendSignedTransaction(callRes),
            getGasPrice: () => 1,
        };
        public utils = {
            sha3: (x: any) => x,
        };
    }
    return Web3;
}

module.exports = web3Factory;
