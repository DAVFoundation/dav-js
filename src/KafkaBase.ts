import DroneChargingNeedParams from './drone-charging/NeedParams';
import DroneChargingBidParams from './drone-charging/BidParams';
import BasicParams from './BasicParams';
import { v4 as uuidV4 } from 'uuid';

enum ClassType {

    DroneDeliveryNeed = 'drone-delivery:need',
    DroneDeliveryBid = 'drone-delivery:bid',
    DroneChargingNeed = 'drone-charging:need',
    DroneChargingBid = 'drone-charging:bid',
}
export default abstract class KafkaBase {

    private static _classEnumToMethod: Map<ClassType, (json: string) => BasicParams> = new Map(
        [
            [ClassType.DroneChargingBid, DroneChargingBidParams.fromJson],
            [ClassType.DroneChargingNeed, DroneChargingNeedParams.fromJson],
        ],
    );

    protected static convertMessage<T extends BasicParams>(message: string): T {
        const messageObject = JSON.parse(message);
        const classEnum = [messageObject.protocol, messageObject.type].join(':') as ClassType;
        const fromJsonMethod = this._classEnumToMethod.get(classEnum);
        if (!!fromJsonMethod) {
            const finalObjectFromStream = fromJsonMethod(message);
            return finalObjectFromStream as T;
        } else {
            throw new Error(`unrecognized message type, message: ${message}`);
        }
    }

    public static generateTopicId(): string {
        return uuidV4();
    }
}
