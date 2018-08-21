import BaseNeedParams from '../NeedParams';
import { ILocation } from '../common-types';

/**
 * @class The Class ride-hailing/NeedParams represent the parameters of ride-hailing need.
 */
export default class NeedParams extends BaseNeedParams {

    private static _protocol = 'RideHailing';
    private static _type = 'Need';

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

    public static fromJson(json: any): NeedParams {
        return new NeedParams(json);
    }

    constructor(values: Partial<NeedParams>) {
        if (!values.pickupLocation || !values.destinationLocation) {
            throw new Error('Need lack of essential details');
        }
        super(values);
        this.pickupLocation = values.pickupLocation;
        this.destinationLocation = values.destinationLocation;
    }

    public toJson(): string {
        const bidParams = Object.assign({ protocol: NeedParams._protocol, type: NeedParams._type }, this);
        return JSON.stringify(bidParams);
    }
}
