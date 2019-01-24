import BaseMessageParams from '../MessageParams';
/**
 * @class The Class vessel-charging/StartingMessageParams represent the parameters of vessel-charging approve mission by the service provider message.
 */
export default class MessageParams extends BaseMessageParams {
    static _messageType: string;
    constructor(values?: Partial<MessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
