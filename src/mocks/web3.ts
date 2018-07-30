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
        };
    }
    return Web3;
}

module.exports = web3Factory;
