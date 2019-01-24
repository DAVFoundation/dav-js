import IPrice from './IPrice';
import { ID, BigInteger, DavID } from './common-types';
import IBasicParams from './IBasicParams';
/**
 * @interface IBidParams extends The interface IBidParams represents valid arguments of BidParams constructor.
 */
export default interface IBidParams extends IBasicParams {
    /**
     * @property The bid's topic id (used to send messages).
     */
    id: ID;
    /**
     * @property The bid's price.
     */
    price: IPrice | BigInteger | Array<IPrice | BigInteger>;
    /**
     * @property The bid's vehicle DAV Id.
     */
    vehicleId: DavID;
    /**
     * @property The consumer DAV Id.
     */
    neederDavId: DavID;
    /**
     * @property Represents if the bidder is committed to provide this bid.
     */
    isCommitted: boolean;
}
