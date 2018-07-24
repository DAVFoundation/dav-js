// tslint:disable:max-classes-per-file

class HttpProvider {
}

function contractFactory(callRes: any) {
    class Contract {
        public methods: any;
        constructor() {
            this.methods = {
                isRegistered: jest.fn(() => ({
                    call: jest.fn(() => Promise.resolve(callRes)),
                })),
                register: jest.fn(() => ({
                    send: jest.fn(() => Promise.resolve(callRes)),
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
        };
    }
    return Web3;
}

module.exports = web3Factory;
