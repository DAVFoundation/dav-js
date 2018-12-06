import IConfig from './IConfig';
import { ID } from './common-types';
import MessageParams from './MessageParams';
/**
 * @class The Message Class represent a single message between consumer and service provider.
 */
export default class Message<T extends MessageParams> {
    selfId: ID;
    private _params;
    private config;
    readonly params: T;
    constructor(selfId: ID, _params: T, config: IConfig);
    /**
     * @method respond Used to reply for the current message.
     * @param params the message parameters.
     */
    respond(params: MessageParams): Promise<void>;
    /**
     * @method getMessageType Used to check the message type and protocol.
     */
    getMessageType(): string;
}
