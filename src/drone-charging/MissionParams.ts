import BaseMissionParams from '../MissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';

/**
 * @interface IMissionParams The interface drone-charging/IMissionParams represent a valid argument of drone-charging/MissionParams constructor.
 */
interface IMissionParams {
    /**
     * @property The mission's topic id (used to send messages to consumer).
     */
    id: ID;
    /**
     * @property The mission's price.
     */
    price: IPrice | BigInteger;
    /**
     * @property The mission's vehicle DAV Id.
     */
    vehicleId: DavID;
    /**
     * @property The consumer DavID.
     */
    neederDavId: DavID;
}
/**
 * @class The Class drone-charging/MissionParams represent the parameters of drone-charging mission.
 */
export default class MissionParams extends BaseMissionParams {

    public static getMessageType(): string {
        return 'DroneCharging:Mission';
    }

    public static fromJson(json: any): MissionParams {
        // TODO?
        return null;
    }

    constructor(values: Partial<IMissionParams>) {
        super(values);
    }

    public toJson(): string {
        // TODO?
        throw new Error('Method not implemented.');
    }

    public toString(): string {
        // TODO?
        return '';
    }

}
