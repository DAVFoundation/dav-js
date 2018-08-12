import BaseNeedParams from '../NeedParams';
import VehicleTypes from './VehicleTypes';

export default class NeedParams extends BaseNeedParams {
    public startAt: number;
    public startLatitude: number;
    public startLongitude: number;
    public endLatitude: number;
    public endLongitude: number;
    public vehicleType: VehicleTypes;
    public maxAltitude: number;

    public static getMessageType(): string {
        return 'DroneDelivery:Need';
    }

    public static fromJson(json: any): NeedParams {
        const needParams = new NeedParams();
        Object.assign(needParams, json);
        return needParams;
    }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
