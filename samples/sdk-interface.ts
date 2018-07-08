namespace Rx { export class Subject<T> { } } // Dummy Definition
class BigInteger { } // Dummy Definition

namespace DAV {
    interface NeedTypeParamas {
        lat: number
        long: number
        radius: number // service radius in meters 
        ttl?: number  // TTL in seconds
    }

    enum PriceType { flat = 'flat' }

    interface BidParams {
        ttl: number // Bid TTL in seconds:
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

    export class Config {

    }

    export class SDKFactory {
        constructor(config: Config = new Config()) { }
        static getIdentity(davId: string, privateKey: string): Identity { return new Identity('', ''); }
    }

    export class Identity {
        constructor(davId: string, privateKey: string) { }
        needs(): Needs { return new Needs(); }
        bid(bidId: string): Bid { return new Bid(); }
        messages(): Rx.Subject<Message> { return new Rx.Subject<Message>(); }
    }

    export class Needs {
        forType(needType: string, params: object): Rx.Subject<Need> { return new Rx.Subject<Need>(); }
    }

    export class Need {
        createBid(params: BidParams): Bid { return new Bid(); }
    }

    export class Bid {
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
        respond(status: MessageStatus, payload: string) { }
    }

    export class Mission {
    }
}