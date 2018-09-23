import BaseNeedParams from '../NeedParams';
import VehicleTypes from './VehicleTypes';
import { ILocation } from '../common-types';
/**
 * @class The Class drone-delivery/NeedParams represent the parameters of drone-delivery need.
 */
export default class NeedParams extends BaseNeedParams {
    private static _protocol;
    private static _type;
    /**
     * @property The delivery pick up time.
     */
    startAt: number;
    /**
     * @property The delivery pick up location.
     */
    startLocation: ILocation;
    /**
     * @property The delivery drop off location.
     */
    endLocation: ILocation;
    /**
     * @property The delivery vehicle.
     */
    vehicleType: VehicleTypes;
    /**
     * @property The max altitude the drone can fly.
     */
    maxAltitude: number;
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
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedParams.d.ts.map