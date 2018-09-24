import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { RideHailingMissionStatus } from '../common-enums';
/**
 * @interface IMessageParams extends The base interface IMessageParams for ride hailing protocol for all messages except OnTheWay message.
 */
interface IMessageParams extends IBaseMessageParams {
    /**
     * @property Last mission status.
     */
    missionStatus: RideHailingMissionStatus;
}
/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for all messages except OnTheWay message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _protocol;
    private static _type;
    missionStatus: RideHailingMissionStatus;
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
        message: typeof MessageParams;
        vehicle_location_message: typeof import("./VehicleLocationMessageParams").default; /**
         * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for all messages except OnTheWay message.
         */
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
    deserialize(json: any): void;
}
export {};
//# sourceMappingURL=MessageParams.d.ts.map