import INeed from './INeed'
import NeedParams from './NeedParams'
import BidParams from './BidParams';
import IPrice from './IPrice';
// ToDo: import Bid from './Bid';

/* tslint:disable *//*ToDo: delete*/class Bid { constructor(params){} }/* tslint:enable */// tslint:disable:max-classes-per-file

export default class Need implements INeed {

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
