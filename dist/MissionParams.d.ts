import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, DavID } from './common-types';
import IMissionParams from './IMissionParams';
/**
 * @class The abstract Class MissionParams represent common parameters of MissionParams classes.
 */
export default abstract class MissionParams extends BasicParams {
    price: IPrice[];
    id: ID;
    neederDavId: DavID;
    vehicleId: DavID;
    constructor(protocol: string, type: string, values?: Partial<IMissionParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=MissionParams.d.ts.map