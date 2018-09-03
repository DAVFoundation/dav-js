import BaseNeedParams from '../NeedParams';
import VehicleTypes from './VehicleTypes';
import { ILocation } from '../common-types';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-delivery/NeedParams represent the parameters of drone-delivery need.
 */
export default class NeedParams extends BaseNeedParams {

    private static _protocol = 'drone_delivery';
    private static _type = 'need';

    /**
     * @property The delivery pick up time.
     */
    public startAt: number;
    /**
     * @property The delivery pick up location.
     */
    public startLocation: ILocation;
    /**
     * @property The delivery drop off location.
     */
    public endLocation: ILocation;
    /**
     * @property The delivery vehicle.
     */
    public vehicleType: VehicleTypes;
    /**
     * @property The max altitude the drone can fly.
     */
    public maxAltitude: number;

    public static getMessageType(): string {
        return NeedParams._type;
    }

    public static getMessageProtocol(): string {
        return NeedParams._protocol;
    }

    constructor(values?: Partial<NeedParams>) {
        super(NeedParams._protocol, NeedParams._type, values);
        if (!!values) {
            this.startAt = values.startAt;
            this.startLocation = {lat: values.startLocation.lat, long: values.startLocation.lat};
            this.endLocation = {lat: values.endLocation.lat, long: values.endLocation.lat};
            this.vehicleType = values.vehicleType;
            this.maxAltitude = values.maxAltitude;
        }
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            vehicleType: this.vehicleType,
            maxAltitude: this.maxAltitude,
        });
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.startLocation = json.startLocation;
        this.endLocation = json.endLocation;
        this.vehicleType = json.vehicleType;
        this.maxAltitude = json.maxAltitude;
    }
}

