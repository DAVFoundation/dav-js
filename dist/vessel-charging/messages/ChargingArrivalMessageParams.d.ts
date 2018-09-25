import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingArrivalMessageParams represent the parameters of boat-charging arrival message.
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
//# sourceMappingURL=ChargingArrivalMessageParams.d.ts.map