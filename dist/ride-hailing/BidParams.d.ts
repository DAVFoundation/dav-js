import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';
/**
 * @interface IVehicleDetails is represents vehicle details in a bid of ride-hailing protocol
 */
interface IVehicleDetails {
    /**
     * @property The vehicle's type.
     */
    type: string;
    /**
     * @property The vehicle's manufacturer.
     */
    manufacturer: string;
    /**
     * @property The vehicle's model.
     */
    model: string;
    /**
     * @property The vehicle's color.
     */
    color: string;
    /**
     * @property The vehicle's license plate.
     */
    licensePlate: string;
}
/**
 * @interface IBidParams The interface ride-hailing/IBidParams represent a valid argument of ride-hailing/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property The provider's vehicle current location (required).
     */
    currentVehicleLocation: Location;
    /**
     * @property The vehicle details.
     */
    vehicle: IVehicleDetails;
    /**
     * @property The driver name.
     */
    driverName: string;
}
/**
 * @class The Class ride-hailing/BidParams represent the parameters of ride-hailing bid.
 */
export default class BidParams extends BaseBidParams {
    private static _protocol;
    private static _type;
    /**
     * @property The provider's vehicle current location.
     */
    currentVehicleLocation: Location;
    /**
     * @property The vehicle details.
     */
    vehicle: IVehicleDetails;
    /**
     * @property The driver name.
     */
    driverName: string;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<IBidParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
    equals(other: BidParams): boolean;
    getProtocolTypes(): {
        need_filter: typeof import("./NeedFilterParams").default;
        need: typeof import("./NeedParams").default;
        bid: typeof BidParams;
        mission: typeof import("./MissionParams").default;
        message: typeof import("./MessageParams").default;
        vehicle_location_message: typeof import("./VehicleLocationMessageParams").default;
        needFilters: string[];
        needs: string[];
        bids: string[];
        missions: string[];
        messages: string[];
    };
}
export {};
//# sourceMappingURL=BidParams.d.ts.map