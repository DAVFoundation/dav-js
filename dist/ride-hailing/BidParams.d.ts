import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';
import { ILocation } from '../common-types';
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
 * The interface ride-hailing/IBidParams represent a valid argument of
 * ride-hailing/BidParams constructor
 *
 * @interface IBidParams
 * @extends {IBaseBidParams}
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property The provider's vehicle current location (required).
     */
    currentVehicleLocation: ILocation;
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
    static _protocol: string;
    static _messageType: string;
    /**
     * @property The provider's vehicle current location.
     */
    currentVehicleLocation: ILocation;
    /**
     * @property The vehicle details.
     */
    vehicle: IVehicleDetails;
    /**
     * @property The driver name.
     */
    driverName: string;
    constructor(values?: Partial<IBidParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
    equals(other: BidParams): boolean;
}
export {};
//# sourceMappingURL=BidParams.d.ts.map