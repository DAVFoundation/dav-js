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
     * @property The passenger's dropoff location (required).
     */
    public destinationLocation: ILocation;

    public static getMessageType(): string {
        return NeedParams._type;
    }

    public static getMessageProtocol(): string {
        return NeedParams._protocol;
    }

    constructor(values?: Partial<NeedParams>) {
        super(NeedParams._protocol, NeedParams._type, values);
        if (!!values) {
            if (!values.pickupLocation || !values.destinationLocation) {
                throw new Error('Need lack of essential details');
            }
            this.pickupLocation = values.pickupLocation;
            this.destinationLocation = values.destinationLocation;
        }
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

    public deserialize(json: any): void {
        super.deserialize(json);
        this.pickupLocation = json.pickupLocation;
        this.destinationLocation = json.destinationLocation;
    }
}
