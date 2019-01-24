import BaseMessageParams from '../MessageParams';
import { ILocation } from '../../common-types';
/**
 * @class The Class vessel-charging/VesselStatusMessageParams represent the parameters of vessel-charging consumer status message.
 */
export default class MessageParams extends BaseMessageParams {
    static _messageType: string;
    location: ILocation;
    constructor(values?: Partial<MessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
