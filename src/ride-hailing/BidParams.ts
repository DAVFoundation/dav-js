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

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    constructor(values?: Partial<IBidParams>) {
        if (!values) {
            super(BidParams._protocol, BidParams._type);
        } else {
            super(BidParams._protocol, BidParams._type, values);
            // TODO: throw if not enough details
            this.currentVehicleLocation = values.currentVehicleLocation;
            this.vehicle = values.vehicle;
            this.driverName = values.driverName;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            currentVehicleLocation: this.currentVehicleLocation,
            vehicle: this.vehicle,
            driverName: this.driverName,
        });
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.currentVehicleLocation = json.currentVehicleLocation;
        this.vehicle = json.vehicle;
        this.driverName = json.driverName;
    }

    public equals(other: BidParams): boolean {
        return this.ttl === other.ttl && super.equals(other);
    }
}
