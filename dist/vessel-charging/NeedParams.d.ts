import BaseNeedParams from '../NeedParams';
import { IDimensions } from '../common-types';
import { EnergySources, Amenities } from './enums';
/**
 * @class The Class boat-charging/NeedParams represent the parameters of boat-charging need.
 */
export default class NeedParams extends BaseNeedParams {
    private static _protocol;
    private static _type;
    radius: number;
    startAt: number;
    dimensions: IDimensions;
    batteryCapacity: number;
    currentBatteryCharge: number;
    energySource: EnergySources;
    amenities: Amenities[];
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<NeedParams>);
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
//# sourceMappingURL=NeedParams.d.ts.map