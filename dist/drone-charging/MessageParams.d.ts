import BaseMessageParams from '../MessageParams';
/**
 * @class The Class drone-charging/MessageParams represent the parameters of drone-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
    static _protocol: string;
    constructor(messageType: string, values?: Partial<MessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
