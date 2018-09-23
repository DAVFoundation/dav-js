import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingCompleteMessageParams represent the parameters of boat-charging complete charging message.
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
//# sourceMappingURL=ChargingCompleteMessageParams.d.ts.map