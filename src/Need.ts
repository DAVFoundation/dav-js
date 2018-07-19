import { ID, BigInteger, Observable } from './common';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import IPrice from './IPrice';
import Bid from './Bid';

export default class Need<T extends NeedParams> {

    constructor(public id: ID, public needTypeId: ID, private _params: T, private config: IConfig) {
        /**/
    }
    public async createBid<U extends BidParams>(price: IPrice | BigInteger, ttl: number, params: U): Promise<Bid<U>> {
        return new Bid<U>(this.id, this.needTypeId, params, this.config);
    }

    public bids<U extends BidParams>(): Observable<Bid<U>> {
        return new Observable<Bid<U>>();
    }
}
