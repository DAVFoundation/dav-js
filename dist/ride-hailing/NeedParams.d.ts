import BaseNeedParams from '../NeedParams';
import { ILocation } from '../common-types';
/**
 * @class The Class ride-hailing/NeedParams represent the parameters of ride-hailing need.
 */
export default class NeedParams extends BaseNeedParams {
    static _protocol: string;
    static _messageType: string;
    /**
     * @property The passenger's pickup location (required).
     */
    pickupLocation: ILocation;
    /**
     * @property The passenger's dropoff location (required).
     */
    destinationLocation: ILocation;
    constructor(values?: Partial<NeedParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
