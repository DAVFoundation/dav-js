import BaseMessageParams from '../MessageParams';
import { ILocation } from '../../common-types';
/**
 * @class The Class boat-charging/VesselStatusMessageParams represent the parameters of boat-charging consumer status message.
 */
export default class MessageParams extends BaseMessageParams {
    private static _type = 'vessel_status_message';
    public location: ILocation;

    public static getMessageType(): string {
        return `${MessageParams._protocol}:${MessageParams._type}`;
    }

    constructor(values?: Partial<MessageParams>) {
        super(MessageParams._type, values);
        if (!!values) {
            if (!values.location) {
                throw new Error('location is a required field');
            }
            this.location = values.location;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            location: this.location,
        });
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.location = json.location;
    }

}
