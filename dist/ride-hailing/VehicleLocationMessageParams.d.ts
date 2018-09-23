import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { ILocation } from '../common-types';
import { RideHailingMissionStatus } from '../common-enums';
/**
 * @interface IMessageParams extends The base interface IMessageParams for ride hailing protocol for OnTheWay message only.
 */
interface IMessageParams extends IBaseMessageParams {
    /**
     * @property Last vehicle location.
     */
    vehicleLocation: ILocation;
}
/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for OnTheWay message only.
 */
export default class MessageParams extends BaseMessageParams {
    private static _protocol;
    private static _type;
    missionStatus: RideHailingMissionStatus;
    vehicleLocation: ILocation;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<IMessageParams>);
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
        message: typeof import("./MessageParams").default;
        vehicle_location_message: typeof MessageParams;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
export {};
//# sourceMappingURL=VehicleLocationMessageParams.d.ts.map