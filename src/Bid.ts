import { ID, Rx} from './common';
import { PriceType } from './enums';
import BidParams from './BidParams';
import Message from './Message';
import {Mission} from '../samples/core';

class Bid {
    public id: ID;
    public priceType: PriceType;
    public price: number;

    constructor(data?: ID | BidParams) { /**/ }

    public accept() { /**/ }
    public async signContract(walletPrivateKey: string): Promise<Mission> { return new Mission(''); }
    public messages(): Rx.Observable<Message> { return new Rx.Observable<Message>(); }
}
export default Bid;
