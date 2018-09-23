import BaseNeedParams from '../NeedParams';
/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
export default class NeedParams extends BaseNeedParams {
    private static _protocol;
    private static _type;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<BaseNeedParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    getProtocolTypes(): {
        need_filter: typeof import("./NeedFilterParams").default;
        need: typeof NeedParams;
        bid: typeof import("./BidParams").default;
        mission: typeof import("./MissionParams").default;
        message: typeof import("./MessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedParams.d.ts.map