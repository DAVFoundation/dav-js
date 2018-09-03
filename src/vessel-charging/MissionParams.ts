import BaseMissionParams from '../MissionParams';
import BaseIMissionParams from '../IMissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';

/**
 * @interface IMissionParams The interface boat-charging/IMissionParams represent a valid argument of boat-charging/MissionParams constructor.
 */
interface IMissionParams extends BaseIMissionParams {
    /**
     * @property The mission's topic id (used to send messages to consumer).
     */
    id: ID;
}
/**
 * @class The Class boat-charging/MissionParams represent the parameters of boat-charging mission.
 */
export default class MissionParams extends BaseMissionParams {
    private static _protocol = 'boat_charging';
    private static _type = 'mission';
    public static getMessageType(): string {
        return `${MissionParams._protocol}:${MissionParams._type}`;
    }

    public static deserialize(json: any): MissionParams {
        const missionParams = super.deserialize(json);
        return new MissionParams(missionParams);
    }

    constructor(values: Partial<IMissionParams>) {
        super(values, MissionParams._protocol, MissionParams._type);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }
}
