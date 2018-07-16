import './common';
import NeedParams from './NeedParams';
import BidParams from './BidParams';
import IPrice from './IPrice';
// ToDo: import Bid from './Bid';

/* tslint:disable *//*ToDo: delete*/class Bid { constructor(params){}}/* tslint:enable */

export default interface INeed {
    id: ID;
    params: NeedParams;
    createBid: (price: IPrice | BigInteger, ttl: number, params: BidParams) => Bid;
    bids: () => Rx.Observable<Bid>;
}
