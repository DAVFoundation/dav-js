import BasicParams from './BasicParams';
import { ID } from './common-types';

/**
 * @class The abstract Class NeedParams represent common parameters to all the SDK's NeedParams classes.
 */
export default abstract class NeedParams extends BasicParams {
    /**
     * @property The need's topic id (used to send messages and bids to consumer).
     */
    public id: ID;
    constructor() {
        super();
    }
}
