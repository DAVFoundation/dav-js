import BaseMessageParams, {
  IMessageParams as IBaseMessageParams,
} from '../MessageParams';

export enum MissionStatus {
  OnTheWay = 'on_the_way',
  VehicleAtPickupLocation = 'vehicle_at_pickup_location',
  PassengerIsComing = 'passenger_is_coming',
  RidingHasStarted = 'riding_has_started',
  RidingHasFinished = 'riding_has_finished',
}

/**
 * @interface IMessageParams extends The base interface IMessageParams for ride hailing protocol for all messages except OnTheWay message.
 */
interface IMessageParams extends IBaseMessageParams {
  /**
   * @property Last mission status.
   */
  missionStatus: MissionStatus;
}

/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for all messages except OnTheWay message.
 */
export default class MessageParams extends BaseMessageParams {
  public static _protocol = 'ride_hailing';
  public static _messageType = 'message';

  public missionStatus: MissionStatus;

  constructor(values?: Partial<IMessageParams>) {
    super(MessageParams._protocol, MessageParams._messageType, values);
    if (!!values) {
      this.missionStatus = values.missionStatus;
    }
  }

  public serialize() {
    const formattedParams = super.serialize();
    Object.assign(formattedParams, {
      missionStatus: this.missionStatus,
    });
    return formattedParams;
  }

  public deserialize(json: any): void {
    super.deserialize(json);
    this.missionStatus = json.missionStatus;
  }
}
