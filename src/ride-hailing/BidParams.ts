import BaseBidParams from '../BidParams';
import IBaseBidParams from '../IBidParams';
import Price from '../Price';
import { callbackify } from 'util';

/**
 * @interface IBidParams The interface ride-hailing/IBidParams represent a valid argument of ride-hailing/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property The provider's vehicle current location (required).
     */
    currentVehicleLocation: Location;
    /**
     * @property The provider's car model (required).
     */
    carModel: string;
    /**
     * @property The provider's car color (required).
     */
    color: string;
    /**
     * @property The provider's car license plate (required).
     */
    licensePlate: string;
    /**
     * @property The driver name.
     */
    driverName: string;
    // TODO: add rank? completed rides? model year?
}
/**
 * @class The Class ride-hailing/BidParams represent the parameters of ride-hailing bid.
 */
export default class BidParams extends BaseBidParams {

    private static _protocol = 'RideHailing';
    private static _type = 'Bid';

    /**
     * @property The provider's vehicle current location.
     */
    public currentVehicleLocation: Location;
    /**
     * @property The provider's car model.
     */
    public carModel: string;
    /**
     * @property The provider's car color.
     */
    public color: string;
    /**
     * @property The provider's car license plate.
     */
    public licensePlate: string;
    /**
     * @property The driver name.
     */
    public driverName: string;

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static fromJson(json: any): BidParams {
        const price = new Price(json.price.value, json.price.type);
        const vehicleId = json.vehicleId;
        if (!!json.description) {
            price.description = json.price.description;
        }
        const bidParams = new BidParams({ price, vehicleId });
        if (!!json.ttl) {
            bidParams.ttl = json.ttl;
        }
        return bidParams;
    }

    constructor(values: Partial<IBidParams>) {
        super(values);
        this.currentVehicleLocation = values.currentVehicleLocation;
        this.color = values.color;
        this.carModel = values.carModel;
        this.driverName = values.driverName;
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
