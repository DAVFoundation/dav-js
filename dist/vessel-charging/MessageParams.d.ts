import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
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
//# sourceMappingURL=MessageParams.d.ts.map