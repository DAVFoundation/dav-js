import IConfig from './IConfig';
import { ID } from './common-types';
import MessageParams from './MessageParams';
import Kafka from './Kafka';
/**
 * @class The DavSDK Message Class represent a single message between consumer and service provider.
 */
export default class Message<T extends MessageParams> {

    constructor(public selfId: ID, public messageParams: MessageParams, private config: IConfig) {
        /* */
    }

    /**
     * @method respond Used to reply a message for the current message.
     * @param params the message parameters.
     */
    public respond(params: MessageParams) {
        params.senderId = this.selfId;
        return Kafka.sendParams(this.messageParams.senderId, params, this.config);
    }
}
