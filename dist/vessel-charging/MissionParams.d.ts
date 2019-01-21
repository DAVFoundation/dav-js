import BaseMissionParams from '../MissionParams';
import BaseIMissionParams from '../IMissionParams';
import { ID } from '../common-types';
/**
 * @interface IMissionParams The interface vessel-charging/IMissionParams represent a valid argument of vessel-charging/MissionParams constructor.
 */
interface IMissionParams extends BaseIMissionParams {
    /**
     * @property The mission's topic id (used to send messages to consumer).
     */
    id: ID;
}
/**
 * @class The Class vessel-charging/MissionParams represent the parameters of vessel-charging mission.
 */
export default class MissionParams extends BaseMissionParams {
    static _protocol: string;
    static _messageType: string;
    static getMessageType(): string;
    static getMessageProtocol(): string;
    constructor(values?: Partial<IMissionParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
export {};
