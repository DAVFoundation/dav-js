declare class Contract {
    static methods: any;
    readonly methods: any;
    static getPastEvents: any;
    readonly getPastEvents: any;
}
declare class Accounts {
    static privateKeyToAccount: any;
    readonly privateKeyToAccount: any;
    static signTransaction: any;
    readonly signTransaction: any;
}
declare class HttpProvider {
}
export default class Web3Mock {
    static providers: {
        HttpProvider: typeof HttpProvider;
    };
    static eth: {
        Contract: typeof Contract;
        accounts: typeof Accounts;
        getGasPrice: () => number;
    };
    readonly eth: any;
    utils: {
        sha3: (x: any) => any;
        toHex: (x: any) => any;
    };
}
export {};
