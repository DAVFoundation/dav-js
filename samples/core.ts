import { IConfig } from './core';
// tslint:disable:max-classes-per-file
export namespace Rx {
  export class Observable<T> {
    public subscribe(success: (t: T) => void, error?: (t: T) => void) { /**/ }
    public filter(cb: (t: T) => boolean): Observable<T> { return this; }
  }
} // Dummy Definition

export type ID = string;
type BigInteger = string;

export enum PriceType { flat = 'flat' }

interface IPrice {
  price: BigInteger; // price in Vinci
  priceType: PriceType;
  priceDescription: string;
}

abstract class BasicParams {
  public ttl?: number; // TTL in seconds
}

export abstract class NeedParams extends BasicParams {
}

export abstract class BidParams extends BasicParams {
}

export abstract class NeedFilterParams extends BasicParams {
  public area?: {
    lat: number;
    long: number;
    radius: number; // service radius in meters
  }; // if null then it is a global service (not limited to a geographic area)
}

export interface IConfig {
  ethNodeUrl?: string;
  ttl?: number;
}

export function SDKFactory(config: IConfig): SDK {
  return new SDK(config);
}

class SDK {
  constructor(private config: IConfig) { /**/ }

  // Not sure this need a config param
  public getIdentity(davId: ID, privateKey: string, config?: IConfig): Identity { return new Identity('', '', this.config); }
  public async isRegistered(davID: ID): Promise<boolean> { return false; }
  public async registerIdentity(davId: ID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string) { /**/ }
}

export class Identity {
  public davId: ID;
  private _messages: Rx.Observable<Message>;

  constructor(davId: ID, privateKey: string, private config: IConfig) {/**/ }

  public needsForType(params: NeedFilterParams): Rx.Observable<Need> { return new Rx.Observable<Need>(); }
  public need(needId: ID): Need { return new Need(needId, this.config); }
  public bid(bidId: ID): Bid { return new Bid(bidId, this.config); }
  public mission(missionId: ID): Mission { return new Mission(missionId, this.config); }
  public messages(): Rx.Observable<Message> {
    if (!this._messages) {
      this._messages = new Rx.Observable<Message>();
    }
    return this._messages;
  }
  public publishNeed(params: NeedParams): Need { return new Need(params, this.config); }
}

class Need {
  public id: ID;
  public params: NeedParams;

  constructor(data: ID | NeedParams, private config: IConfig) { /**/ }

  public createBid(price: IPrice | BigInteger, ttl: number, params: BidParams):
    Bid { return new Bid(params, this.config); }
  public bids(): Rx.Observable<Bid> { return new Rx.Observable<Bid>(); }
}

class Bid {
  public id: ID;
  public priceType: PriceType;
  public price: number;

  constructor(data: ID | BidParams, private config: IConfig) { /**/ }

  public accept() { /**/ }
  public async signContract(walletPrivateKey: string): Promise<Mission> { return new Mission('', this.config); }
  public messages(): Rx.Observable<Message> { return new Rx.Observable<Message>(); }
}

enum MessageStatus {
  accepted = 'accepted',
  contractSigned = 'contract_signed',
}

enum MessageDomain {
  mission = 'mission',
  bid = 'bid',
}

export class Message {
  public bid: Bid;
  public mission: Mission;
  public status: MessageStatus;
  public domain: MessageDomain;

  public respond(type: string, payload: any) { /**/ }
}

interface ISendMessageParams {
  recipients?: ID[];
}

export class Mission {
  public id: ID;
  public needer: Identity;

  constructor(missionId: ID, private config: IConfig) { /**/ }

  public sendMessage(type: string, payload: any, params: ISendMessageParams) { /**/ }
  public messages(): Rx.Observable<Message> { return new Rx.Observable<Message>(); }
  public finalizeMission(walletPrivateKey: string) { /**/ }
}
