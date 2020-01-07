"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:max-classes-per-file
class Contract {
    get methods() {
        return Contract.methods;
    }
    get getPastEvents() {
        return Contract.getPastEvents;
    }
}
class Accounts {
    get privateKeyToAccount() {
        return Accounts.privateKeyToAccount;
    }
    get signTransaction() {
        return Accounts.signTransaction;
    }
}
class HttpProvider {
}
class Web3Mock {
    constructor() {
        this.utils = {
            sha3: (x) => x,
            toHex: (x) => x,
        };
    }
    get eth() {
        return Web3Mock.eth;
    }
}
Web3Mock.providers = { HttpProvider };
Web3Mock.eth = { Contract, accounts: Accounts, getGasPrice: () => 1 };
exports.default = Web3Mock;

//# sourceMappingURL=Web3Mock.js.map
