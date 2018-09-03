import IBasicParams from './IBasicParams';

/**
 * @class The abstract Class BasicParams represent common parameters to all the SDK's Params classes.
 */
export default abstract class BasicParams {
    /**
     * Hop limit, in seconds, for the inherited class.
     */
    public ttl?: number; // TTL in seconds

    public static getMessageType(): string {
        throw new Error('Must be implemented by derived class');
    }

    public constructor(private _protocol: string, private _type: string, values?: Partial<IBasicParams>) {
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

    public deserialize(json: any): void {
        this.ttl = json.ttl;
    }
}
