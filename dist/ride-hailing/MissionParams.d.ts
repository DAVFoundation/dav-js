import BaseMissionParams from '../MissionParams';
import IBaseMissionParams from '../IMissionParams';
/**
 * @class The Class ride-hailing/MissionParams represent the parameters of ride-hailing mission.
 */
export default class MissionParams extends BaseMissionParams {
    static _protocol: string;
    static _messageType: string;
    constructor(values?: Partial<IBaseMissionParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=MissionParams.d.ts.map