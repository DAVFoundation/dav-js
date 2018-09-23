import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/ChargingStartedMessageParams represent the parameters of provider notifying that charging has begun.
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
//# sourceMappingURL=ChargingStartedMessageParams.d.ts.map