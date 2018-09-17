import BasicParams from './BasicParams';
import { DavID, ILocation } from './common-types';
/**
 * @class The abstract Class NeedFilterParams represent common parameters of NeedFilterParams classes.
 */
export default abstract class NeedFilterParams extends BasicParams {
    /**
     * @property The service provider location.
     */
    location: ILocation;
    /**
     * @property The service provider max supported distance. if null then it is a global service (not limited to a geographic area)
     */
    radius: number;
    /**
     * @property Provider Dav ID.
     */
    davId: DavID;
    constructor(protocol: string, type: string, values?: Partial<NeedFilterParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedFilterParams.d.ts.map