import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';
import Price from '../Price';

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
        return `${this._protocol}:${this._type}`;
    }

    public static fromJson(json: any): BidParams {
        return new BidParams(json);
    }

    constructor(values: Partial<IBidParams>) {
        super(values);
        // TODO: throw if not enough details
        this.currentVehicleLocation = values.currentVehicleLocation;
        this.vehicle = values.vehicle;
        this.driverName = values.driverName;
        this.averageRating = values.averageRating;
        this.ratingCounter = values.ratingCounter;
    }

    public toJson() {
        const bidParams = Object.assign({ protocol: BidParams._protocol, type: BidParams._type }, this);
        return JSON.stringify(bidParams);
    }

    public toString(): string {
        return this.toJson();
    }

    public equals(other: BidParams): boolean {
        return this.ttl === other.ttl && this.price.equals(other.price);
    }
}
