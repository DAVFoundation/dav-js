import { ID } from './common-types';

export default abstract class BasicParams {
    public ttl?: number; // TTL in seconds
    public sourceId: ID;

    public abstract toJson(): string;
}
