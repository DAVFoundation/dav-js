import BaseMessageParams from '../MessageParams';
/**
 * @class The Class vessel-charging/ChargingCompleteMessageParams represent the parameters of vessel-charging complete charging message.
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
//# sourceMappingURL=ChargingCompleteMessageParams.d.ts.map