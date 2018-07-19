import { ID, BigInteger, Observable } from './common';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import IPrice from './IPrice';
import Bid from './Bid';

export default class Need {

    constructor(public id: ID, public needTypeId: ID, private params: NeedParams, private config: IConfig) {
        /**/
    }
    public async createBid(price: IPrice | BigInteger, ttl: number, params: BidParams): Promise<Bid> {
        return new Bid(this.id, this.needTypeId, params, this.config);
    }

    public bids(): Observable<Bid> {
        return new Observable<Bid>();
    }
}
