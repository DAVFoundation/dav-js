import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { RideHailingMissionStatus } from '../common-enums';

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
        return `${this._protocol}:${this._type}`;
    }

    constructor(values?: Partial<IMessageParams>) {
        super(MessageParams._protocol, MessageParams._type, values);
        if (!!values) {
            this.missionStatus = values.missionStatus;
        }
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
        });
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.missionStatus = json.missionStatus;
    }
}
