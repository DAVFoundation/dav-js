import BaseBidParams from '../BidParams';
import { ID, DavID, ILocation } from '../common-types';
import IBaseBidParams from '../IBidParams';
import { EnergySources, Amenities } from './enums';

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

    public static _protocol = 'boat_charging';
    public static _messageType = 'bid';
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
        return BidParams._messageType;
    }

    public static getMessageProtocol(): string {
        return BidParams._protocol;
    }

    constructor(values?: Partial<IBidParams>) {
        super(BidParams._protocol, BidParams._messageType, values);
        if (!!values) {
            if (!values.availableFrom) {
                throw new Error('availableFrom is a required field');
            }
            this.entranceLocation = values.entranceLocation;
            this.exitLocation = values.exitLocation;
            this.availableFrom = values.availableFrom;
            this.availableUntil = values.availableUntil;
            this.energySource = values.energySource;
            this.amenities = values.amenities;
            this.provider = values.provider;
            this.manufacturer = values.manufacturer;
            this.model = values.model;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
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
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.entranceLocation = json.entranceLocation;
        this.exitLocation = json.exitLocation;
        this.availableFrom = json.availableFrom;
        this.availableUntil = json.availableUntil;
        this.energySource = json.energySource;
        this.amenities = json.amenities;
        this.provider = json.provider;
        this.manufacturer = json.manufacturer;
        this.model = json.model;
    }

    public equals(other: BidParams): boolean {
        return super.equals(other);
    }
}
