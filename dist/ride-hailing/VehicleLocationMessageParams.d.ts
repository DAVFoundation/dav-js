import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
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
    static _protocol: string;
    static _messageType: string;
    missionStatus: MissionStatus;
    vehicleLocation: ILocation;
    constructor(values?: Partial<IMessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
export {};
