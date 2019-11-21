import BasicParams from './BasicParams';
import IPrice from './IPrice';
import { ID, DavID } from './common-types';
import IBidParams from './IBidParams';
/**
 * @class The abstract Class BidParams represent common parameters of BidParams classes.
 */
export default abstract class BidParams extends BasicParams {
    id: ID;
    price: IPrice[];
    vehicleId: DavID;
    neederDavId: DavID;
    isCommitted: boolean;
    constructor(protocol: string, type: string, values?: Partial<IBidParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
    equals(other: BidParams): boolean;
}
//# sourceMappingURL=BidParams.d.ts.map