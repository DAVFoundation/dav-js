import BaseNeedFilterParams from '../NeedFilterParams';
import { IDimensions } from '../common-types';
/**
 * @class The Class boat-charging/NeedFilterParams represent the parameters that used to filter boat-charging needs.
 */
export default class NeedFilterParams extends BaseNeedFilterParams {
    private static _protocol;
    private static _type;
    maxDimensions: IDimensions;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<NeedFilterParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    getProtocolTypes(): {
        need_filter: typeof NeedFilterParams;
        need: typeof import("./NeedParams").default;
        bid: typeof import("./BidParams").default;
        mission: typeof import("./MissionParams").default;
        charging_arrival_message: typeof import("./messages/ChargingArrivalMessageParams").default;
        charging_complete_message: typeof import("./messages/ChargingCompleteMessageParams").default;
        charging_started_message: typeof import("./messages/ChargingStartedMessageParams").default;
        decline_message: typeof import("./messages/DeclineMessageParams").default;
        provider_status_message: typeof import("./messages/ProviderStatusMessageParams").default;
        starting_message: typeof import("./messages/StartingMessageParams").default;
        status_request_message: typeof import("./messages/StatusRequestMessageParams").default;
        vessel_status_message: typeof import("./messages/VesselStatusMessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedFilterParams.d.ts.map