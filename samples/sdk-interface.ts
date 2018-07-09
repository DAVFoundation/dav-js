namespace Rx { export class Subject<T> { } } // Dummy Definition

namespace DAV {
    type ID = string;
    type BigInteger = string;

    interface NeedTypeParams {
        lat: number
        long: number
        radius: number // service radius in meters 
        ttl?: number  // TTL in seconds
    }

    enum PriceType { flat = 'flat' }

    interface BasicParams {
        ttl: number // Bid TTL in seconds:
    }

    interface BidParams extends BasicParams {
        price: {
            price: BigInteger // price in Vinci
            price_type: PriceType
            price_description: string
        } | BigInteger // (in that case, flat price_type is assumed)
        extra?: {
            name?: string
            eta?: number // Time from contract signing to delivery in seconds
        }
    }

    enum VehicleTypes {
        drone = 'drone'
    }

    interface NeedParams extends BasicParams {
        start_at: number,
        start_latitude: number,
        start_longitude: number,
        end_latitude: number,
        end_longitude: number,
        vehicle_type: VehicleTypes,
        max_altitude: number,
    }

    export class Config {

    }

    export function SDKFactory(config: Config = new Config()): SDK {
        return new SDK(config)
    }

    export class SDK {
        constructor(config: Config = new Config()) { }

        //Not sure this need a config param
        getIdentity(davId: ID, privateKey: string, config?: Config): Identity { return new Identity('', ''); }
        async isRegistered(ID): Promise<boolean> { return false; }
        async registerIdentity(davId: ID, walletAddress: string, walletPrivateKey: string, identityPrivateKey: string) { }
    }

    export class Identity {
        constructor(davId: ID, privateKey: string) { }

        davId: ID

        needs(): Needs { return new Needs(); }
        need(needId: ID): Need { return new Need(needId); }
        bid(bidId: ID): Bid { return new Bid(bidId); }
        mission(missionId: ID): Mission { return new Mission(missionId); }
        messages(): Rx.Subject<Message> { return new Rx.Subject<Message>(); }
        publishNeed(needType: NeedType, params: NeedParams): Need { return new Need(''); }
    }

    enum NeedType {

    }

    export class Needs {
        forType(needType: NeedType, params: object): Rx.Subject<Need> { return new Rx.Subject<Need>(); }
    }

    export class Need {
        constructor(needId: ID) { }

        id: ID

        createBid(params: BidParams): Bid { return new Bid(params); }
        bids(): Rx.Subject<Bid> { return new Rx.Subject<Bid>(); }
    }

    export class Bid {
        constructor(bidId: ID)
        constructor(params: BidParams)
        constructor(data?: ID | BidParams) { }

        id: ID
        priceType: PriceType
        price: number

        accept() { }
        async signContract(walletPrivateKey: string): Promise<Mission> { return new Mission(''); }
        messages(): Rx.Subject<Message> { return new Rx.Subject<Message>(); }
    }

    enum MessageStatus {
        accepted = 'accepted',
        contract_signed = 'contract_signed'
    }

    enum MessageDomain {
        mission = 'mission',
        bid = 'bid'
    }

    export class Message {
        bid: Bid
        mission: Mission
        status: MessageStatus
        domain: MessageDomain

        respond(type: string, payload: any) { }
    }

    interface SendMessageParams {
        recipients?: Array<ID>
    }

    export class Mission {
        constructor(missionId: ID) { }

        id: ID
        needer: Identity

        sendMessage(type: string, payload: any, params: SendMessageParams) { }
        messages(): Rx.Subject<Message> { return new Rx.Subject<Message>(); }
        finalizeMission(walletPrivateKey: string) { }
    }
}

export = {
    SDKFactory: DAV.SDKFactory,
    Config: DAV.Config
};
