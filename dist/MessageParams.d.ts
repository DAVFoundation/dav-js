import BasicParams from './BasicParams';
import { ID, BigInteger } from './common-types';
export interface IMessageParams {
    /**
     * @property The message sender id.
     */
    senderId: ID | BigInteger;
}
/**
 * @class The abstract Class MessageParams represent common parameters of MessageParams classes.
 */
export default abstract class MessageParams extends BasicParams {
    /**
     * @property The message sender id.
     */
    senderId: ID | BigInteger;
    constructor(protocol: string, type: string, values?: Partial<MessageParams>);
    serialize(): {
        ttl: number;
        protocol: string;
        type: string;
    };
    deserialize(json: any): void;
}
