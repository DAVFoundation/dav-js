import BaseMissionParams from '../MissionParams';
import IMissionParams from '../IMissionParams';
/**
 * @class The Class drone-delivery/MissionParams represent the parameters of drone-delivery mission.
 */
export default class MissionParams extends BaseMissionParams {
    private static _protocol;
    private static _type;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<IMissionParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    getProtocolTypes(): {
        need_filter: typeof import("./NeedFilterParams").default;
        need: typeof import("./NeedParams").default;
        bid: typeof import("./BidParams").default;
        mission: typeof MissionParams;
        message: typeof import("./MessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=MissionParams.d.ts.map