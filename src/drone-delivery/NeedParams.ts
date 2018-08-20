import BaseNeedParams from '../NeedParams';
import VehicleTypes from './VehicleTypes';

/**
 * @class The Class drone-delivery/NeedParams represent the parameters of drone-delivery need.
 */
export default class NeedParams extends BaseNeedParams {
    /**
     * @property The delivery pick up time.
     */
    public startAt: Date;
    /**
     * @property The delivery pick up latitude.
     */
    public startLatitude: number;
    /**
     * @property The delivery pick up longitude.
     */
    public startLongitude: number;
    /**
     * @property The delivery drop off latitude.
     */
    public endLatitude: number;
    /**
     * @property The delivery drop off longitude.
     */
    public endLongitude: number;
    /**
     * @property The delivery vehicle.
     */
    public vehicleType: VehicleTypes;
    /**
     * @property The max altitude the drone can fly.
     */
    public maxAltitude: number;

    public static getMessageType(): string {
        return 'DroneDelivery:Need';
    }

    public static fromJson(json: any): NeedParams {
        const needParams = new NeedParams(json);
        Object.assign(needParams, json);
        return needParams;
    }

    constructor(values: Partial<NeedParams>) {
        super();
        Object.assign(this, values);
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
