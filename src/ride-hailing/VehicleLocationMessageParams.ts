import BaseMessageParams, { IMessageParams as IBaseMessageParams } from '../MessageParams';
import { ILocation } from '../common-types';
import { RideHailingMissionStatus } from '../common-enums';
import ProtocolTypes from './ProtocolTypes';

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
    private static _type = 'vehicle_location_message';

    public missionStatus: RideHailingMissionStatus;
    public vehicleLocation: ILocation;

    public static getMessageType(): string {
        return MessageParams._type;
    }

    public static getMessageProtocol(): string {
        return MessageParams._protocol;
    }

    public static deserialize(json: any): MessageParams {
        const messageParams = super.deserialize(json);
        Object.assign(messageParams, {
            missionStatus: json.missionStatus,
            vehicleLocation: json.vehicleLocation,
        });
        return new MessageParams(json);
    }

    constructor(values: Partial<IMessageParams>) {
        super(values, MessageParams._protocol, MessageParams._type);
        this.vehicleLocation = values.vehicleLocation;
        this.missionStatus = RideHailingMissionStatus.OnTheWay;
    }

    public serialize() {
        const formattedParams = super.serialize();
        Object.assign(formattedParams, {
            missionStatus: this.missionStatus,
            vehicleLocation: this.vehicleLocation,
        });
        return formattedParams;
    }

    public getProtocolTypes() {
        return ProtocolTypes;
    }
}
