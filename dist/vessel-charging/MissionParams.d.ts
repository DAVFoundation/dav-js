import BaseMissionParams from '../MissionParams';
import BaseIMissionParams from '../IMissionParams';
import { ID } from '../common-types';
/**
 * @interface IMissionParams The interface boat-charging/IMissionParams represent a valid argument of boat-charging/MissionParams constructor.
 */
interface IMissionParams extends BaseIMissionParams {
    /**
     * @property The mission's topic id (used to send messages to consumer).
     */
    id: ID;
}
/**
 * @class The Class boat-charging/MissionParams represent the parameters of boat-charging mission.
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
export {};
//# sourceMappingURL=MissionParams.d.ts.map