import BaseNeedParams from '../NeedParams';
import { ILocation } from '../common-types';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class ride-hailing/NeedParams represent the parameters of ride-hailing need.
 */
export default class NeedParams extends BaseNeedParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'need';

    /**
     * @property The passenger's pickup location (required).
     */
    public pickupLocation: ILocation;
    /**
     * @property The passenger's desired location (required).
     */
    public destinationLocation: ILocation;

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static deserialize(json: any): NeedParams {
        const needParams = super.deserialize(json);
        Object.assign(needParams, {
            pickupLocation: json.pickupLocation,
            destinationLocation: json.destinationLocation,
        });
        return new NeedParams(json);
    }

    constructor(values: Partial<NeedParams>) {
        if (!values.pickupLocation || !values.destinationLocation) {
            throw new Error('Need lack of essential details');
        }
        super(values, NeedParams._protocol, NeedParams._type);
        this.pickupLocation = values.pickupLocation;
        this.destinationLocation = values.destinationLocation;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            pickupLocation: this.pickupLocation,
            destinationLocation: this.destinationLocation,
        });
        return formattedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
