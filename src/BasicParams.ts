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

<<<<<<< HEAD
    public static getMessageProtocol(): string {
        throw new Error('Must be implemented by derived class');
    }

    public constructor(values: Partial<IBasicParams>, private _protocol: string, private _type: string) {
=======
    public constructor(private _protocol: string, private _type: string, values?: Partial<IBasicParams>) {
>>>>>>> 6396c3ed09d258b6e913b2e192c2b83d04e27fbf
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

<<<<<<< HEAD
    public abstract getProtocolTypes(): any;
=======
    public deserialize(json: any): void {
        this.ttl = json.ttl;
    }
>>>>>>> 6396c3ed09d258b6e913b2e192c2b83d04e27fbf
}
