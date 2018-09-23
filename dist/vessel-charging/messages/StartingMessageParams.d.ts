import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/StartingMessageParams represent the parameters of boat-charging approve mission by the service provider message.
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
//# sourceMappingURL=StartingMessageParams.d.ts.map