import BasicParams from './BasicParams';
import { ID, DavID } from './common-types';

/**
 * @class The abstract Class NeedParams represent common parameters of NeedParams classes.
 */
export default abstract class NeedParams extends BasicParams {
    /**
     * @property The need's topic id (used to send messages and bids to consumer).
     */
    public id: ID;
    /**
     * @property The need's topic id (used to send messages and bids to consumer).
     */
    public davId: DavID;
    public location: {
        /**
         * @property supported area latitude.
         */
        latitude: number;
        /**
         * @property supported area longitude.
         */
        longitude: number;
    };

    constructor(values: Partial<NeedParams>, protocol: string, type: string) {
        super(values, protocol, type);
        this.id = values.id;
    }
}
