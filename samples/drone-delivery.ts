// tslint:disable:max-classes-per-file
import * as Core from './core';

enum VehicleTypes {
    drone = 'drone',
}

export class NeedFilterParams extends Core.NeedFilterParams {
    constructor(values: Partial<NeedFilterParams>) { super(); }
}

export class NeedParams extends Core.NeedParams {
    public startAt: number;
    public startLatitude: number;
    public startLongitude: number;
    public endLatitude: number;
    public endLongitude: number;
    public vehicleType: VehicleTypes;
    public maxAltitude: number;

    constructor(values: Partial<NeedParams>) { super(); }
}

export class BidParams extends Core.BidParams {
    public name?: string;
    public eta?: number; // Time from contract signing to delivery in seconds

    constructor(init?: Partial<BidParams>) {
        super();
    }
}
