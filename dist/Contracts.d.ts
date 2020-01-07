import IConfig from './IConfig';
import { DavID, ID } from './common-types';
import { ContractTypes } from './common-enums';
import { EventLog, TransactionReceipt } from 'web3/types';
import { Observable } from 'rxjs';
export default class Contracts {
    private static initWeb3;
    private static getContract;
    private static sendSignedTransaction;
    private static checkContractPastEvents;
    private static toSafeGasLimit;
    private static calculatePrice;
    static generateMissionId(config: IConfig): string;
    static isIdentityRegistered(davId: DavID, config: IConfig): Promise<boolean>;
    static registerIdentity(davId: DavID, identityPrivateKey: string, walletAddress: string, walletPrivateKey: string, config: IConfig): Promise<string>;
    static approveMission(davId: DavID, walletPrivateKey: string, config: IConfig): Promise<TransactionReceipt>;
    static startMission(missionId: ID, davId: DavID, walletPublicKey: string, walletPrivateKey: string, vehicleId: DavID, config: IConfig): Promise<TransactionReceipt>;
    static finalizeMission(missionId: ID, davId: DavID, walletPublicKey: string, walletPrivateKey: string, config: IConfig): Promise<TransactionReceipt>;
    static watchContract(davId: string, contractType: ContractTypes, config: IConfig): Observable<EventLog>;
}
