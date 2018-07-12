// tslint:disable:max-classes-per-file
namespace Rx {
  export class Subject<T> {
    public subscribe(success: (t: T) => void, error?: (t: T) => void) { /**/ }
    public filter(cb: (t: T) => boolean): Subject<T> { return this; }
  }
} // Dummy Definition

type ID = string;
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

interface IConfig {
  ethNodeUrl?: string;
  ttl?: number;
}

export function SDKFactory(config: IConfig): SDK {
  return new SDK(config);
}

class SDK {
  constructor(config: IConfig) { /**/ }

  // Not sure this need a config param
  public getIdentity(davId: ID, privateKey: string, config?: IConfig): Identity { return new Identity('', ''); }
  public async isRegistered(davID: ID): Promise<boolean> { return false; }
  public async registerIdentity(davId: ID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string) { /**/ }
}

class Identity {
  public davId: ID;
  private _messages: Rx.Subject<Message>;

  constructor(davId: ID, privateKey: string) {/**/ }

  public needsForType(params: NeedFilterParams): Rx.Subject<Need> { return new Rx.Subject<Need>(); }
  public need(needId: ID): Need { return new Need(needId); }
  public bid(bidId: ID): Bid { return new Bid(bidId); }
  public mission(missionId: ID): Mission { return new Mission(missionId); }
  public messages(): Rx.Subject<Message> {
    if (!this._messages) {
      this._messages = new Rx.Subject<Message>();
    }
    return this._messages;
  }
  public publishNeed(params: NeedParams): Need { return new Need(params); }
}

class Need {
  public id: ID;
  public params: NeedParams;

  constructor(data: ID | NeedParams) { /**/ }

  public createBid(price: IPrice | BigInteger, ttl: number, params: BidParams):
    Bid { return new Bid(params); }
  public bids(): Rx.Subject<Bid> { return new Rx.Subject<Bid>(); }
}

class Bid {
  public id: ID;
  public priceType: PriceType;
  public price: number;

  constructor(data?: ID | BidParams) { /**/ }

  public accept() { /**/ }
  public async signContract(walletPrivateKey: string): Promise<Mission> { return new Mission(''); }
  public messages(): Rx.Subject<Message> { return new Rx.Subject<Message>(); }
}

enum MessageStatus {
  accepted = 'accepted',
  contractSigned = 'contract_signed',
}

enum MessageDomain {
  mission = 'mission',
  bid = 'bid',
}

class Message {
  public bid: Bid;
  public mission: Mission;
  public status: MessageStatus;
  public domain: MessageDomain;

  public respond(type: string, payload: any) { /**/ }
}

interface ISendMessageParams {
  recipients?: ID[];
}

class Mission {
  public id: ID;
  public needer: Identity;

  constructor(missionId: ID) { /**/ }

  public sendMessage(type: string, payload: any, params: ISendMessageParams) { /**/ }
  public messages(): Rx.Subject<Message> { return new Rx.Subject<Message>(); }
  public finalizeMission(walletPrivateKey: string) { /**/ }
}
