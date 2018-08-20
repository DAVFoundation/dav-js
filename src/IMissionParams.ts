import IPrice from './IPrice';
import { ID, DavID, BigInteger } from './common-types';
import IBasicParams from './IBasicParams';

/**
 * @interface IMissionParams The interface IMissionParams represent a valid argument of MissionParams constructor.
 */
export default interface IMissionParams extends IBasicParams {
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
