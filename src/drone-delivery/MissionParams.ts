import BaseMissionParams from '../MissionParams';
import { ID, DavID, BigInteger } from '../common-types';
import IPrice from '../IPrice';
import IMissionParams from '../IMissionParams';
import ProtocolTypes from './ProtocolTypes';

/**
 * @class The Class drone-delivery/MissionParams represent the parameters of drone-delivery mission.
 */
export default class MissionParams extends BaseMissionParams {

    private static _protocol = 'drone_delivery';
    private static _type = 'mission';

    public static getMessageType(): string {
        return MissionParams._type;
    }

    public static getMessageProtocol(): string {
        return MissionParams._protocol;
    }

    constructor(values?: Partial<IMissionParams>) {
        super(MissionParams._protocol, MissionParams._type, values);
    }

    public serialize() {
        const formatedParams = super.serialize();
        return formatedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
