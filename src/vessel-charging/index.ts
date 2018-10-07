import { MessageCategories } from './../KafkaMessageFactory';
import * as enums from './enums';
import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import KafkaMessageFactory from '../KafkaMessageFactory';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import ChargingArrivalMessageParams from './messages/ChargingArrivalMessageParams';
import ChargingCompleteMessageParams from './messages/ChargingCompleteMessageParams';
import ChargingStartedMessageParams from './messages/ChargingStartedMessageParams';
import DeclineMessageParams from './messages/DeclineMessageParams';
import ProviderStatusMessageParams from './messages/ProviderStatusMessageParams';
import StartingMessageParams from './messages/StartingMessageParams';
import StatusRequestMessageParams from './messages/StatusRequestMessageParams';
import StatusMessageParams from './messages/StatusMessageParams';

export {
  enums,
  NeedParams,
  NeedFilterParams,
  BidParams,
  MissionParams,
  ChargingArrivalMessageParams,
  ChargingCompleteMessageParams,
  ChargingStartedMessageParams,
  DeclineMessageParams,
  ProviderStatusMessageParams,
  StartingMessageParams,
  StatusRequestMessageParams,
  StatusMessageParams,
};

KafkaMessageFactory.instance.registerMessageClasses([
  {
    protocol: NeedFilterParams._protocol,
    messageType: NeedFilterParams._messageType,
    messageCategory: MessageCategories.NeedFilter,
    classType: NeedFilterParams,
  },
  {
    protocol: NeedParams._protocol,
    messageType: NeedParams._messageType,
    messageCategory: MessageCategories.Need,
    classType: NeedParams,
  },
  {
    protocol: BidParams._protocol,
    messageType: BidParams._messageType,
    messageCategory: MessageCategories.Bid,
    classType: BidParams,
  },
  {
    protocol: MissionParams._protocol,
    messageType: MissionParams._messageType,
    messageCategory: MessageCategories.Mission,
    classType: MissionParams,
  },
  {
    protocol: ChargingArrivalMessageParams._protocol,
    messageType: ChargingArrivalMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: ChargingArrivalMessageParams,
  },
  {
    protocol: ChargingCompleteMessageParams._protocol,
    messageType: ChargingCompleteMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: ChargingCompleteMessageParams,
  },
  {
    protocol: ChargingStartedMessageParams._protocol,
    messageType: ChargingStartedMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: ChargingStartedMessageParams,
  },
  {
    protocol: DeclineMessageParams._protocol,
    messageType: DeclineMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: DeclineMessageParams,
  },
  {
    protocol: ProviderStatusMessageParams._protocol,
    messageType: ProviderStatusMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: ProviderStatusMessageParams,
  },
  {
    protocol: StartingMessageParams._protocol,
    messageType: StartingMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: StartingMessageParams,
  },
  {
    protocol: StatusRequestMessageParams._protocol,
    messageType: StatusRequestMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: StatusRequestMessageParams,
  },
  {
    protocol: StatusMessageParams._protocol,
    messageType: StatusMessageParams._messageType,
    messageCategory: MessageCategories.Message,
    classType: StatusMessageParams,
  },
]);
