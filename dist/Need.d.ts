import { ID, Observable } from './common-types';
import IConfig from './IConfig';
import BidParams from './BidParams';
import NeedParams from './NeedParams';
import Bid from './Bid';
import MessageParams from './MessageParams';
import Message from './Message';
/**
 * @class The Need class represent a service request.
 */
export default class Need<T extends NeedParams> {
    private _selfId;
    private _params;
    private _config;
    readonly params: T;
    constructor(_selfId: ID, _params: T, _config: IConfig);
    /**
     * @method createBid Used to create a new bid for the current need and publish it to the service consumer.
     * @param bidParams The bid parameters.
     * @returns The created bid.
     */
    createBid<V extends BidParams>(bidParams: V): Promise<Bid<V>>;
    /**
     * @method bids Used to subscribe for bids for the current need.
     * @returns Observable for bids subscription.
     */
    bids<V extends BidParams>(): Promise<Observable<Bid<V>>>;
    /**
     * @method sendMessage Used to send a message to the service consumer.
     * @param params The message parameters.
     */
    sendMessage(params: MessageParams): Promise<void>;
    /**
     * @method messages Used to subscribe for messages for the current need.
     * @param filterType (optional) array of the expected message params object type.
     * @returns Observable for messages subscription.
     */
    messages<U extends MessageParams>(filterType?: string[]): Promise<Observable<Message<U>>>;
}
//# sourceMappingURL=Need.d.ts.map