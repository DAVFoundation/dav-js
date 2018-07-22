import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import Message from './Message';
import Mission from './Mission';
import Identity from './Identity';

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
            undefined /* no peer yet */, new Identity('id', 'davId', this.config), this.config);
    }
    public messages(): Observable<Message<T>> { return new Observable<Message<T>>(); }
}

