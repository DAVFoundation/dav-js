import BaseMessageParams from '../MessageParams';
/**
 * @class The Class boat-charging/MessageParams represent the parameters of boat-charging message.
 */
export default abstract class MessageParams extends BaseMessageParams {
    protected static _protocol: string;
    static getMessageProtocol(): string;
    constructor(messageType: string, values?: Partial<MessageParams>);
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
//# sourceMappingURL=MessageParams.d.ts.map