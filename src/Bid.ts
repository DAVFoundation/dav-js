import { ID, Observable } from './common';
import IConfig from './IConfig';
import BidParams from './BidParams';
import Message from './Message';
import Mission from './Mission';

export default class Bid<T extends BidParams> {
    get params(): T {
        return this._params;
    }

    constructor(public needId: ID, public needTypeId: ID, private _params: T, private config: IConfig) {
        /**/
    }

    public async accept() { /**/ }
    public async signContract(walletPrivateKey: string): Promise<Mission> {
        return new Mission(''/* new topic */,
            undefined /* no peer yet */, this.config);
    }
    public messages(): Observable<Message> { return new Observable<Message>(); }
}

