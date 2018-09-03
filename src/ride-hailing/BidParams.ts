import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';
import Price from '../Price';
import ProtocolTypes from './ProtocolTypes';

/**
 * @interface IVehicleDetails The interface for vehicle details in bid for ride-hailing protocol
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
    /**
     * @property Average rating from 1 to 5.
     */
    averageRating: number;
    /**
     * @property Number of times the driver was rated.
     */
    ratingCounter: number;
}
/**
 * @class The Class ride-hailing/BidParams represent the parameters of ride-hailing bid.
 */
export default class BidParams extends BaseBidParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'bid';

    /**
     * @property The provider's vehicle current location.
     */
    public currentVehicleLocation: Location;
    /**
     * @property The vehicle details.
     */
    public vehicle: IVehicleDetails;
    /**
     * @property The driver name.
     */
    public driverName: string;
    /**
     * @property Average rating from 1 to 5.
     */
    public averageRating: number;
    /**
     * @property Number of times the driver was rated.
     */
    public ratingCounter: number;

    public static getMessageType(): string {
        return BidParams._protocol;
    }

    public static getMessageProtocol(): string {
        return BidParams._type;
    }

    public static deserialize(json: any): BidParams {
        const bidParams = super.deserialize(json);
        Object.assign(bidParams, {
            currentVehicleLocation: json.currentVehicleLocation,
            vehicle: json.vehicle,
            driverName: json.driverName,
            averageRating: json.averageRating,
            ratingCounter: json.ratingCounter,
        });
        return new BidParams(bidParams);
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        // TODO: throw if not enough details
        this.currentVehicleLocation = values.currentVehicleLocation;
        this.vehicle = values.vehicle;
        this.driverName = values.driverName;
        this.averageRating = values.averageRating;
        this.ratingCounter = values.ratingCounter;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            currentVehicleLocation: this.currentVehicleLocation,
            vehicle: this.vehicle,
            driverName: this.driverName,
            averageRating: this.averageRating,
            ratingCounter: this.ratingCounter,
        });
        return formattedParams;
    }

    public equals(other: BidParams): boolean {
        return this.ttl === other.ttl && super.equals(other);
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
