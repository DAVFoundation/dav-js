import BaseMessageParams from '../MessageParams';
/**
 * @class The Class drone-charging/MessageParams represent the parameters of drone-charging message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _protocol;
    private static _type;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<MessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
