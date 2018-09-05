import IConfig from './IConfig';
import { ID } from './common-types';
import MessageParams from './MessageParams';
import Kafka from './Kafka';
/**
 * @class The Message Class represent a single message between consumer and service provider.
 */
export default class Message<T extends MessageParams> {

    public get params(): T {
        return this._params;
    }

    constructor(public selfId: ID, private _params: T, private config: IConfig) {
        /* */
    }
    /**
     * @method respond Used to reply for the current message.
     * @param params the message parameters.
     */
    public respond(params: MessageParams): Promise<void> {
        params.senderId = this.selfId;
        return Kafka.sendParams(this._params.senderId, params, this.config);
    }
    /**
     * @method getMessageType Used to check the message type and protocol.
     */
    public getMessageType(): string {
        const formattedParams = this._params.serialize();
        return `${formattedParams.protocol}:${formattedParams.type}`;
    }
}
