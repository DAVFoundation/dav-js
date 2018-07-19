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
    public async createBid<T extends BidParams>(price: IPrice | BigInteger, ttl: number, params: T): Promise<Bid<T>> {
        return new Bid<T>(this.id, this.needTypeId, params, this.config);
    }

    public bids<T extends BidParams>(): Observable<Bid<T>> {
        return new Observable<Bid<T>>();
    }
}
