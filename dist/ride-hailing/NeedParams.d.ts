import BaseNeedParams from '../NeedParams';
import { ILocation } from '../common-types';
/**
 * @class The Class ride-hailing/NeedParams represent the parameters of ride-hailing need.
 */
export default class NeedParams extends BaseNeedParams {
    private static _protocol;
    private static _type;
    /**
     * @property The passenger's pickup location (required).
     */
    pickupLocation: ILocation;
    /**
     * @property The passenger's dropoff location (required).
     */
    destinationLocation: ILocation;
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
        message: typeof import("./MessageParams").default;
        vehicle_location_message: typeof import("./VehicleLocationMessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedParams.d.ts.map