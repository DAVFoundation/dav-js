import BaseMessageParams, {
  IMessageParams as IBaseMessageParams,
} from '../MessageParams';
import { ILocation } from '../common-types';
import { MissionStatus } from './MessageParams';

/**
 * @interface IMessageParams extends The base interface IMessageParams for ride hailing protocol for OnTheWay message only.
 */
interface IMessageParams extends IBaseMessageParams {
  /**
   * @property Last vehicle location.
   */
  vehicleLocation: ILocation;
}

/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for OnTheWay message only.
 */
export default class MessageParams extends BaseMessageParams {
  public static _protocol = 'ride_hailing';
  public static _messageType = 'vehicle_location_message';

  public missionStatus: MissionStatus;
  public vehicleLocation: ILocation;

  constructor(values?: Partial<IMessageParams>) {
    super(MessageParams._protocol, MessageParams._messageType, values);
    if (!!values) {
      this.vehicleLocation = values.vehicleLocation;
      this.missionStatus = MissionStatus.OnTheWay;
    }
  }

  public serialize() {
    const formattedParams = super.serialize();
    Object.assign(formattedParams, {
      missionStatus: this.missionStatus,
      vehicleLocation: this.vehicleLocation,
    });
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    this.missionStatus = json.missionStatus;
    this.vehicleLocation = json.vehicleLocation;
  }
}
