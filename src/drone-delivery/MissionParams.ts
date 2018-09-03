import BaseMissionParams from '../MissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';
import IMissionParams from '../IMissionParams';

/**
 * @class The Class drone-delivery/MissionParams represent the parameters of drone-delivery mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'DroneDelivery';
    private static _type = 'Mission';

    public static getMessageType(): string {
        return `${MissionParams._protocol}:${MissionParams._type}`;
    }

    constructor(values?: Partial<IMissionParams>) {
        super(MissionParams._protocol, MissionParams._type, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
