import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingArrivalMessageParams represent the parameters of boat-charging arrival message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type;
    static getMessageType(): string;
    constructor(values?: Partial<MessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=ChargingArrivalMessageParams.d.ts.map