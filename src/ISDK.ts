import {ID, IConfig, Identity} from '../samples/core';

interface ISDK {
    // Not sure this need a config param
    getIdentity: (davId: ID, privateKey: string, config?: IConfig) => Identity;
    isRegistered: (davID: ID) => Promise<boolean>;
    registerIdentity: (davId: ID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string) => void;
  }
