import BaseNeedParams from '../NeedParams';
import { IDimensions } from '../common-types';
import { EnergySources, Amenities } from './enums';

/**
 * @class The Class drone-charging/NeedParams represent the parameters of drone-charging need.
 */
export default class NeedParams extends BaseNeedParams {
  public static _protocol = 'drone_charging';
  public static _messageType = 'need';
  public radius: number;
  public startAt: number;
  public dimensions: IDimensions;
  public batteryCapacity: number;
  public currentBatteryCharge: number;
  public energySource: EnergySources;
  public amenities: Amenities[];

  constructor(values?: Partial<NeedParams>) {
    super(NeedParams._protocol, NeedParams._messageType, values);
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
