import BasicParams from './BasicParams';
import { ID, DavID, ILocation } from './common-types';

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
    public location: ILocation;

    public static deserialize(json: any) {
        const needParams = {
            id: json.id,
            location: {
                lat: json.location && json.location.latitude,
                long: json.location && json.location.longitude,
            },
            davId: json.davId,
        };
        return needParams  as NeedParams;
    }

    constructor(values: Partial<NeedParams>, protocol: string, type: string) {
        super(values, protocol, type);
        this.id = values.id;
        this.davId = values.davId;
        if (!!values.location) {
            this.location = {
                lat: values.location.lat,
                long: values.location.long,
            };
        }
    }

    public serialize() {
        const formatedParams: any = {
            id: this.id,
            location: {
                latitude: this.location && this.location.lat,
                longitude: this.location && this.location.long,
            },
            davId: this.davId,
        };
        return formatedParams;
    }
}
