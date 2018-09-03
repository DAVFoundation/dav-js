import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { ILocation } from '../common-types';
import { RideHailingMissionStatus } from '../common-enums';

/**
 * @interface IMessageParams extends The base interface IMessageParams for ride hailing protocol for OnTheWay message only.
 */
interface IMessageParams extends IBaseMessageParams {
    /**
     * @property Last vehicle location.
     */
    vehicleLocation: ILocation;
}

/**
 * @class The Class ride-hailing/MessageParams represent the parameters of ride-hailing message for OnTheWay message only.
 */
export default class MessageParams extends BaseMessageParams {

    private static _protocol = 'ride_hailing';
    private static _type = 'vehicleLocationMessage';

    public missionStatus: RideHailingMissionStatus;
    public vehicleLocation: ILocation;

    public static getMessageType(): string {
        return `${this._protocol}:${this._type}`;
    }

    constructor(values?: Partial<IMessageParams>) {
        super(MessageParams._protocol, MessageParams._type, values);
        if (!!values) {
            this.vehicleLocation = values.vehicleLocation;
            this.missionStatus = RideHailingMissionStatus.OnTheWay;
        }

    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
            vehicleLocation: this.vehicleLocation,
        });
        return formattedParams;
    }

    public deserialize(json: any): void {
        super.deserialize(json);
        this.missionStatus = json.missionStatus;
        this.vehicleLocation = json.vehicleLocation;
    }
}
