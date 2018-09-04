import NeedParams from './NeedParams';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import ChargingArrivalMessageParams from './messages/ChargingArrivalMessageParams';
import ChargingCompleteMessageParams from './messages/ChargingCompleteMessageParams';
import ChargingStartedMessageParams from './messages/ChargingStartedMessageParams';
import DeclineMessageParams from './messages/DeclineMessageParams';
import ProviderStatusMessageParams from './messages/ProviderStatusMessageParams';
import StartingMessageParams from './messages/StartingMessageParams';
import StatusRequestMessageParams from './messages/StatusRequestMessageParams';
import VesselStatusMessageParams from './messages/VesselStatusMessageParams';
import NeedFilterParams from './NeedFilterParams';

export default {
    need_filter: NeedFilterParams,
    need: NeedParams,
    bid: BidParams,
    mission: MissionParams,
    charging_arrival_message: ChargingArrivalMessageParams,
    charging_complete_message: ChargingCompleteMessageParams,
    charging_started_message: ChargingStartedMessageParams,
    decline_message: DeclineMessageParams,
    provider_status_message: ProviderStatusMessageParams,
    starting_message: StartingMessageParams,
    status_request_message: StatusRequestMessageParams,
    vessel_status_message: VesselStatusMessageParams,
    needFilters: [
        'need_filter',
    ],
    needs: [
        'need',
    ],
    bids: [
        'bid',
    ],
    missions: [
        'mission',
    ],
    messages: [
        'charging_arrival_message',
        'charging_complete_message',
        'charging_started_message',
        'decline_message',
        'provider_status_message',
        'starting_message',
        'status_request_message',
        'vessel_status_message',
    ],
};
