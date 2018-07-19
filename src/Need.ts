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
    public async createBid(price: IPrice | BigInteger, ttl: number, params: BidParams): Promise<Bid> {
        return new Bid(this.id, this.needTypeId, params, this.config);
    }

    public getParams(): T {
        return this._params as T;
    }

    public bids(): Observable<Bid> {
        return new Observable<Bid>();
    }
}
