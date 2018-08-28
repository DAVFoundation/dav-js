import BaseBidParams from '../BidParams';
import { ID, DavID, ILocation } from '../common-types';
import IBaseBidParams from '../IBidParams';
import { EnergySources, Amenities } from './enums';

/**
 * @interface IBidParams The interface boat-charging/IBidParams represent a valid argument of boat-charging/BidParams constructor.
 */
interface IBidParams extends IBaseBidParams {
    /**
     * @property The charging station entrance location.
     */
    entranceLocation: ILocation;
    /**
     * @property The charging station exir location.
     */
    exitLocation: ILocation;
    /**
     * @property The time from which the charger can be made available for the vessel requesting a charge.
     * Specified as time in milliseconds since Epoch/Unix Time.
     */
    availableFrom: number;
    /**
     * @property The time until which the charger can be made available for the vessel requesting a charge.
     * Specified as time in milliseconds since Epoch/Unix Time
     */
    availableUntil: number;
    /**
     * @property The source of the energy used by this charger. Specified as an energy source id.
     */
    energySource: EnergySources;
    /**
     * @property A list of amenities that are present at this charger. Specified as a comma separated list of amenity ids.
     */
    amenities: Amenities[];
    /**
     * @property Name of the service provider or charging network operating this charger.
     */
    provider: string;
    /**
     * @property Name of the manufacturer of this charger.
     */
    manufacturer: string;
    /**
     * @property Name of the model of this charger.
     */
    model: string;
}

/**
 * @class The Class boat-charging/BidParams represent the parameters of boat-charging bid.
 */
export default class BidParams extends BaseBidParams {

    private static _protocol = 'BoatCharging';
    private static _type = 'Bid';
    public entranceLocation: ILocation;
    public exitLocation: ILocation;
    public availableFrom: number;
    public availableUntil: number;
    public energySource: EnergySources;
    public amenities: Amenities[];
    public provider: string;
    public manufacturer: string;
    public model: string;

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static deserialize(json: any): BidParams {
        const bidParams = super.deserialize(json);
        Object.assign(bidParams, {
            entranceLocation: json.entranceLocation,
            exitLocation: json.exitLocation,
            availableFrom: json.availableFrom,
            availableUntil: json.availableUntil,
            energySource: json.energySource,
            amenities: json.amenities,
            provider: json.amenities,
            manufacturer: json.amenities,
            model: json.amenities,

        });
        return new BidParams(bidParams);
    }

    constructor(values: Partial<IBidParams>) {
        super(values, BidParams._protocol, BidParams._type);
        Object.assign(this, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            entranceLocation: this.entranceLocation,
            exitLocation: this.exitLocation,
            availableFrom: this.availableFrom,
            availableUntil: this.availableUntil,
            energySource: this.energySource,
            amenities: this.amenities,
            provider: this.amenities,
            manufacturer: this.amenities,
            model: this.amenities,
        });
        return formatedParams;
    }
    public equals(other: BidParams): boolean {
        return super.equals(other);
    }
}
