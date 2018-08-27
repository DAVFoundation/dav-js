import BaseNeedParams from '../NeedParams';
import VehicleTypes from './VehicleTypes';
import { ILocation } from '../common-types';

/**
 * @class The Class drone-delivery/NeedParams represent the parameters of drone-delivery need.
 */
export default class NeedParams extends BaseNeedParams {

    private static _protocol = 'DroneDelivery';
    private static _type = 'Need';

    /**
     * @property The delivery pick up time.
     */
    public startAt: Date;
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
        return `${NeedParams._protocol}:${NeedParams._type}`;
    }

    public static deserialize(json: any) {
        const needParams = super.deserialize(json);
        Object.assign(needParams, {
            startLocation: json.startLocation,
            endLocation: json.endLocation,
            vehicleType: json.vehicleType,
            maxAltitude: json.maxAltitude,
        });
        return needParams;
    }

    constructor(values: Partial<NeedParams>) {
        super(values, NeedParams._protocol, NeedParams._type);
        Object.assign(this, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            startLocation: this.startLocation,
            endLocation: this.endLocation,
            vehicleType: this.vehicleType,
            maxAltitude: this.maxAltitude,
            protocol: NeedParams._protocol,
            type: NeedParams._type,
        });
        return formatedParams;
    }
}

