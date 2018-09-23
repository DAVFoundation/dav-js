import BaseMessageParams from '../MessageParams';
/**
 * @class The Class drone-delivery/MessageParams represent the parameters of drone-delivery message.
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
    getProtocolTypes(): {
        need_filter: typeof import("./NeedFilterParams").default;
        need: typeof import("./NeedParams").default;
        bid: typeof import("./BidParams").default;
        mission: typeof import("./MissionParams").default;
        message: typeof MessageParams;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=MessageParams.d.ts.map