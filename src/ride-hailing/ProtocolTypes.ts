import NeedParams from './NeedParams';
import NeedFilterParams from './NeedFilterParams';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams from './MessageParams';
import VehicleLocationMessageParams from './VehicleLocationMessageParams';

export default {
    need_filter: NeedFilterParams,
    need: NeedParams,
    bid: BidParams,
    mission: MissionParams,
    message: MessageParams,
    vehicle_location_message: VehicleLocationMessageParams,
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
        'vehicle_location_message',
        'message',
    ],
};
