// tslint:disable:max-classes-per-file

class Methods {
    // return async function for execute smart contract method in the EVM without sending any transaction.
    public isRegistered(davID: string): any {
        return async () => davID === 'REGISTERED_ADDRESS';
    }
}

class HttpProvider {
    constructor(public provider: string) {
        this.provider = provider;
    }
}

class Contract {
    constructor(public methods: Methods) {
        this.methods = new Methods();
    }
}

const _eth = { Contract };
const _providers = { HttpProvider };

class Web3 {
    constructor(public eth: any, public provider: any) {
        this.eth = _eth;
    }
}

const web3 = Web3 as any;
web3.providers = _providers;

module.exports = web3;
