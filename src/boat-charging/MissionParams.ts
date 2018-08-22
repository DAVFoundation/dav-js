import BaseMissionParams from '../MissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';

/**
 * @interface IMissionParams The interface boat-charging/IMissionParams represent a valid argument of boat-charging/MissionParams constructor.
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
 * @class The Class boat-charging/MissionParams represent the parameters of boat-charging mission.
 */
export default class MissionParams extends BaseMissionParams {
    private static _protocol = 'boat_charging';
    private static _type = 'mission';
    public static getMessageType(): string {
        return 'boat_charging:mission';
    }

    public static fromJson(json: any): MissionParams {
        // TODO?
        return null;
    }

    constructor(values: Partial<IMissionParams>) {
        super(values);
    }

    public toJson() {
        const needParams = Object.assign({ protocol: MissionParams._protocol, type: MissionParams._type }, this);
        return JSON.stringify(needParams);
    }

    public toString(): string {
        // TODO?
        return '';
    }

}
