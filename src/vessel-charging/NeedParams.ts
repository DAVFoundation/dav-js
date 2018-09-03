import BaseNeedParams from '../NeedParams';
import { IDimensions } from '../common-types';
import { EnergySources, Amenities } from './enums';

/**
 * @class The Class boat-charging/NeedParams represent the parameters of boat-charging need.
 */
export default class NeedParams extends BaseNeedParams {
    private static _protocol = 'boat_charging';
    private static _type = 'need';
    public radius: number;
    public startAt: number;
    public dimensions: IDimensions;
    public batteryCapacity: number;
    public currentBatteryCharge: number;
    public energySource: EnergySources;
    public amenities: Amenities[];

    public static getMessageType(): string {
        return `${NeedParams._protocol}:${NeedParams._type}`;
    }

    constructor(values?: Partial<NeedParams>) {
        super(NeedParams._protocol, NeedParams._type, values);
        if (!!values) {
            if (!values.location) {
                throw new Error('location is a required field');
            }
            this.startAt = values.startAt;
            this.dimensions = values.dimensions;
            this.batteryCapacity = values.batteryCapacity;
            this.currentBatteryCharge = values.currentBatteryCharge;
            this.energySource = values.energySource;
            this.amenities = values.amenities;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            startAt: this.startAt,
            dimensions: this.dimensions,
            batteryCapacity: this.batteryCapacity,
            currentBatteryCharge: this.currentBatteryCharge,
            energySource: this.energySource,
            amenities: this.amenities,
        });
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.startAt = json.startAt;
        this.dimensions = json.dimensions;
        this.batteryCapacity = json.batteryCapacity;
        this.currentBatteryCharge = json.currentBatteryCharge;
        this.energySource = json.energySource;
        this.amenities = json.amenities;
    }

}
