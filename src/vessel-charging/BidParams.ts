import BaseBidParams from '../BidParams';
import { ID, DavID, ILocation } from '../common-types';
import IBaseBidParams from '../IBidParams';
import { EnergySources, Amenities } from './enums';
import ProtocolTypes from './ProtocolTypes';

/**
 * @interface IBidParams The interface boat-charging/IBidParams represent a valid argument of boat-charging/BidParams constructor.
 */

interface IBidParams extends IBaseBidParams {
    /**
     * @property A human readable name/description of the charger location (e.g., Cal Maritime Dock C).
     */
    locationName: string;
    /**
     * @property The language used in location_name. Specified using the 3 letter ISO 639-3 language code.
     */
    locationNameLang: string;
    /**
     * @property The city where the charger is located.
     */
    locationCity: string;
    /**
     * @property The postal code of the charger address.
     */
    locationPostalCode: string;
    /**
     * @property The county where the charger is located.
     */
    locationCounty: string;
    /**
     * @property The state where the charger is located.
     */
    locationState: string;
    /**
     * @property The country where the charger is located.
     */
    locationCountry: string;
    /**
     * @property The charging station entrance location.
     */
    entranceLocation: ILocation;
    /**
     * @property The charging station exit location.
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
    public locationName: string;
    public locationNameLang: string;
    public locationCity: string;
    public locationPostalCode: string;
    public locationCounty: string;
    public locationState: string;
    public locationCountry: string;
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
        return BidParams._type;
    }

    public static getMessageProtocol(): string {
        return BidParams._protocol;
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
        if (!values.availableFrom) {
            throw new Error('availableFrom is a required field');
        }
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

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
