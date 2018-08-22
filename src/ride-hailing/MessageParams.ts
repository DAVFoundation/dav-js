import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { ILocation } from '../common-types';

/**
 * @enum The enum RideHailingMissionStatus represent the mission statuses after the contract has been signed
 *  - all statuses are sent by the driver except PassengerIsComing.
 */
enum RideHailingMissionStatus {
    OnTheWay = 'on_the_way',
    VehicleAtPickupLocation = 'vehicle_at_pickup_location',
    PassengerIsComing = 'passenger_is_coming',
    RidingHasStarted = 'riding_has_started',
    RidingHasFinished = 'riding_has_finished',
}

interface IMessageParams extends IBaseMessageParams {
    /**
     * @property Last mission status.
     */
    missionStatus: RideHailingMissionStatus;
}

/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message.
 */
export default class MessageParams extends BaseMessageParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'message';

    public missionStatus: RideHailingMissionStatus;
    public vehicleLocation: ILocation;

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    public static fromJson(json: any): MessageParams {
        return new MessageParams(json);
    }

    constructor(values: Partial<IMessageParams>) { super(values); }

    public toJson(): string {
        throw new Error('Method not implemented.');
    }

    public toString(): string {
        throw new Error('Method not implemented.');
    }
}
