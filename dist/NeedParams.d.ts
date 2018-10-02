import BasicParams from './BasicParams';
import { ID, DavID, ILocation } from './common-types';
/**
 * @class The abstract Class NeedParams represent common parameters of NeedParams classes.
 */
export default abstract class NeedParams extends BasicParams {
    /**
     * @property The need's topic id (used to send messages and bids to consumer).
     */
    id: ID;
    /**
     * @property The need's topic id (used to send messages and bids to consumer).
     */
    davId: DavID;
    /**
     * @property The consumer current location.
     */
    location: ILocation;
    constructor(protocol: string, type: string, values?: Partial<NeedParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
//# sourceMappingURL=NeedParams.d.ts.map