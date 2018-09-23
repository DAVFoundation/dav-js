import BaseNeedFilterParams from '../NeedFilterParams';
/**
 * @class The Class ride-hailing/NeedFilterParams represent the parameters that used to filter ride-hailing needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol;
    private static _type;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<NeedFilterParams>);
    getProtocolTypes(): {
        need_filter: typeof NeedFilterParams;
        need: typeof import("./NeedParams").default;
        bid: typeof import("./BidParams").default;
        mission: typeof import("./MissionParams").default;
        message: typeof import("./MessageParams").default;
        vehicle_location_message: typeof import("./VehicleLocationMessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedFilterParams.d.ts.map