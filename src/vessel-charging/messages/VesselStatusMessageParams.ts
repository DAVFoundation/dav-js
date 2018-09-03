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

    public static deserialize(json: any): MessageParams {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {
            location: json.location,
        });
        return new MessageParams(messageParams);
    }

    constructor(values: Partial<MessageParams>) {
        super(values, MessageParams._type);
        if (!values.location) {
            throw new Error('location is a required field');
        }
        this.location = values.location;
    }

    public serialize() {
        const formatedParams = super.serialize();
        Object.assign(formatedParams, {
            location: this.location,
        });
        return formatedParams;
    }
}
