import { ID, BigInteger, Rx } from './common';
import NeedParams from './NeedParams';
import BidParams from './BidParams';
import IPrice from './IPrice';
import Bid from './Bid';

export default class Need {

    public id: ID;
    public params: NeedParams;

    constructor(data: ID | NeedParams) {
         /**/
    }
    public createBid(price: IPrice | BigInteger, ttl: number, params: BidParams): Bid {
        return new Bid(params);
    }

    public bids(): Rx.Observable<Bid> {
        return new Rx.Observable<Bid>();
    }
}
