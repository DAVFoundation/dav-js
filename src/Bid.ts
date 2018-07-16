import { ID, Observable } from './common';
import IConfig from './IConfig';
import { PriceType } from './enums';
import BidParams from './BidParams';
import Message from './Message';
import Mission from './Mission';

export default class Bid {
    public id: ID;
    public priceType: PriceType;
    public price: number;

    constructor(data: ID | BidParams, private config: IConfig) {
        /**/
    }

    public accept() { /**/ }
    public async signContract(walletPrivateKey: string): Promise<Mission> { return new Mission('', this.config); }
    public messages(): Observable<Message> { return new Observable<Message>(); }
}

