import BaseMessageParams from '../MessageParams';
/**
 * @class The Class drone-charging/ChargingCompleteMessageParams represent the parameters of drone-charging complete charging message.
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
