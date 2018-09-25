import { MessageCategories } from './../KafkaMessageFactory';
import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import KafkaMessageFactory from '../KafkaMessageFactory';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams, { MissionStatus } from './MessageParams';
import VehicleLocationMessageParams from './VehicleLocationMessageParams';

/**
 * @enum The enum RideHailingMissionStatus represent the mission statuses after the contract has been signed
 *  - all statuses are sent by the driver except PassengerIsComing.
 */

export { NeedFilterParams, NeedParams, BidParams, MissionParams, MessageParams, VehicleLocationMessageParams, MissionStatus };

KafkaMessageFactory.instance.registerMessageClasses([
    {
        protocol: NeedFilterParams._protocol, messageType: NeedFilterParams._messageType,
        messageCategory: MessageCategories.NeedFilter, classType: NeedFilterParams,
    },
    {
        protocol: NeedParams._protocol, messageType: NeedParams._messageType,
        messageCategory: MessageCategories.Need, classType: NeedParams,
    },
    {
        protocol: BidParams._protocol, messageType: BidParams._messageType,
        messageCategory: MessageCategories.Bid, classType: BidParams,
    },
    {
        protocol: MissionParams._protocol, messageType: MissionParams._messageType,
        messageCategory: MessageCategories.Mission, classType: MissionParams,
    },
    {
        protocol: MessageParams._protocol, messageType: MessageParams._messageType,
        messageCategory: MessageCategories.Message, classType: MessageParams,
    },
    {
        protocol: VehicleLocationMessageParams._protocol, messageType: VehicleLocationMessageParams._messageType,
        messageCategory: MessageCategories.Message, classType: VehicleLocationMessageParams,
    },
]);
