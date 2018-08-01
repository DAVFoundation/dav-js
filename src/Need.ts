import { ID, BigInteger, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import IPrice from './IPrice';
import Bid from './Bid';
import MessageParams from './MessageParams';

export default class Need<T extends NeedParams> {

    constructor(public id: ID, public needTypeId: ID, private _params: T, private config: IConfig) {
        /**/
    }
    public async createBid<U extends BidParams, V extends MessageParams>(price: IPrice | BigInteger, ttl: number, params: U): Promise<Bid<U, V>> {
        return new Bid<U, V>(this.id, this.needTypeId, params, this.config);
    }

    public bids<U extends BidParams, V extends MessageParams>(): Observable<Bid<U, V>> {
        return null;
    }
}
