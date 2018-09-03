import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { RideHailingMissionStatus } from '../common-enums';
import ProtocolTypes from './ProtocolTypes';

/**
 * @interface IMessageParams extends The base interface IMessageParams for ride hailing protocol for all messages except OnTheWay message.
 */
interface IMessageParams extends IBaseMessageParams {
    /**
     * @property Last mission status.
     */
    missionStatus: RideHailingMissionStatus;
}

/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for all messages except OnTheWay message.
 */
export default class MessageParams extends BaseMessageParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'message';

    public missionStatus: RideHailingMissionStatus;

    public static getMessageType(): string {
        return MessageParams._protocol;
    }

    public static getMessageProtocol(): string {
        return MessageParams._type;
    }

    public static deserialize(json: any): MessageParams {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {
            missionStatus: json.missionStatus,
        });
        return new MessageParams(json);
    }

    constructor(values: Partial<IMessageParams>) {
        super(values, MessageParams._protocol, MessageParams._type);
        this.missionStatus = values.missionStatus;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
        });
        return formattedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
