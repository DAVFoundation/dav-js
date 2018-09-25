import BaseMissionParams from '../MissionParams';
import IBaseMissionParams from '../IMissionParams';

/**
 * @class The Class ride-hailing/MissionParams represent the parameters of ride-hailing mission.
 */
export default class MissionParams extends BaseMissionParams {

    public static _protocol = 'ride_hailing';
    public static _messageType = 'mission';

    constructor(values?: Partial<IBaseMissionParams>) {
        super(MissionParams._protocol, MissionParams._messageType, values);
    }

    public serialize() {
        const formattedParams = super.serialize();
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
    }
}
