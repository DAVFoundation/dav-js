import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
export declare enum MissionStatus {
    OnTheWay = "on_the_way",
    VehicleAtPickupLocation = "vehicle_at_pickup_location",
    PassengerIsComing = "passenger_is_coming",
    RidingHasStarted = "riding_has_started",
    RidingHasFinished = "riding_has_finished"
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
    static _protocol: string;
    static _messageType: string;
    missionStatus: MissionStatus;
    constructor(values?: Partial<IMessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
export {};
