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

    public static deserialize(json: any) {
        const needParams = super.deserialize(json);
        Object.assign(needParams, {
            id: json.id,
            location: json.location,
            davId: json.davId,
        });
        return needParams as NeedParams;
    }

    constructor(values: Partial<NeedParams>, protocol: string, type: string) {
        super(values, protocol, type);
        this.id = values.id;
        this.davId = values.davId;
        if (!!values.location) {
            this.location = {
                latitude: values.location.latitude,
                longitude: values.location.longitude,
            };
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            id: this.id,
            location: this.location,
            davId: this.davId,
        });
        return formattedParams;
    }
}
