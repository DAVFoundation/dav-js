// tslint:disable:max-classes-per-file
class Contract {
  public static methods: any;
  public get methods(): any {
    return Contract.methods;
  }
  public static getPastEvents: any;
  public get getPastEvents(): any {
    return Contract.getPastEvents;
  }
}

class Accounts {
  public static privateKeyToAccount: any;
  public get privateKeyToAccount(): any {
    return Accounts.privateKeyToAccount;
  }
  public static signTransaction: any;
  public get signTransaction(): any {
    return Accounts.signTransaction;
  }
}

class HttpProvider {}

export default class Web3Mock {
  public static providers = { HttpProvider };
  public static eth = { Contract, accounts: Accounts, getGasPrice: () => 1 };
  public get eth(): any {
    return Web3Mock.eth;
  }
  public utils = {
    sha3: (x: any) => x,
  };
}
