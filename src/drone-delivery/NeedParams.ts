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

    constructor(values: Partial<NeedParams>) { super(); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }
}
