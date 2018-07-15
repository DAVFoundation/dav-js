import './common-definitions';
import NeedParams from './NeedParams';
import BidParams from './BidParams';
import IPrice from './IPrice';
//ToDo: import Bid from './Bid';

/*ToDo: delete*/class Bid {}

export default interface INeed {
    id: ID;
    params: NeedParams;
    createBid: { (price: IPrice | BigInteger, ttl: number, params: BidParams): Bid };
    bids: { (): Rx.Subject<Bid> };
}