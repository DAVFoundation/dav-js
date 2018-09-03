import IBasicParams from './IBasicParams';

/**
 * @class The abstract Class BasicParams represent common parameters to all the SDK's Params classes.
 */
export default abstract class BasicParams {
    /**
     * Hop limit, in seconds, for the inherited class.
     */
    public ttl?: number; // TTL in seconds

    public static deserialize(json: any): BasicParams {
        const basicParams = {
            ttl: json.ttl,
        };
        return basicParams as BasicParams;
    }

    public static getMessageType(): string {
        throw new Error('Must be implemented by derived class');
    }

    public static getMessageProtocol(): string {
        throw new Error('Must be implemented by derived class');
    }

    public constructor(values: Partial<IBasicParams>, private _protocol: string, private _type: string) {
        if (!!values) {
            this.ttl = values.ttl;
        }
    }

    public serialize() {
        return {
            ttl: this.ttl,
            protocol: this._protocol,
            type: this._type,
        };
    }

    public abstract getProtocolTypes(): any;
}
