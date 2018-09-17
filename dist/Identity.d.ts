import { Observable, DavID, ID } from './common-types';
import IConfig from './IConfig';
import NeedFilterParams from './NeedFilterParams';
import NeedParams from './NeedParams';
import BidParams from './BidParams';
import MissionParams from './MissionParams';
import MessageParams from './MessageParams';
import Need from './Need';
import Bid from './Bid';
import Message from './Message';
import Mission from './Mission';
/**
 * @class The Identity class represent registered DAV identity instance.
 */
export default class Identity {
    id: ID;
    davId: DavID;
    private _config;
    private topics;
    constructor(id: ID, davId: DavID, _config: IConfig);
    private registerNewTopic;
    /**
     * @method publishNeed Used to create a new need and publish it to the relevant service providers.
     * @param needParams the need parameters.
     * @returns the created need.
     */
    publishNeed<T extends NeedParams>(needParams: T): Promise<Need<T>>;
    /**
     * @method needsForType Used to subscribe for specific needs (filtered by params).
     * @param needFilterParams the filter parameters.
     * @returns Observable for needs subscription.
     */
    needsForType<T extends NeedParams>(needFilterParams: NeedFilterParams): Promise<Observable<Need<T>>>;
    /**
     * @method missions Used to subscribe for missions.
     * @returns Observable for missions subscription.
     */
    missions<T extends MissionParams, U extends MessageParams>(): Promise<Observable<Mission<T>>>;
    /**
     * @method messages Used to subscribe for messages.
     * @returns Observable for messages subscription.
     */
    messages<T extends MessageParams>(): Promise<Observable<Message<T>>>;
    /**
     * @method need Used to restore an existed need.
     * @param needSelfId The selfId that used to create the bid.
     * @param params The need parameters.
     * @returns The restored need.
     */
    need<T extends NeedParams, U extends MessageParams>(needSelfId: ID, params: T): Need<T>;
    /**
     * @method bid Used to restore an existed bid.
     * @param bidSelfId The selfId that used to create the bid.
     * @param params The bid parameters.
     * @returns The restored bid.
     */
    bid<T extends BidParams, U extends MessageParams>(bidSelfId: ID, params: T): Bid<T>;
    /**
     * @method mission Used to restore an existed mission.
     * @param missionSelfId The mission self topic ID.
     * @param missionPeerId The mission peer topic ID.
     * @param params The mission parameters.
     * @returns The restored mission.
     */
    mission<T extends MissionParams, U extends MessageParams>(missionSelfId: ID, missionPeerId: ID, params: T): Mission<T>;
}
//# sourceMappingURL=Identity.d.ts.map