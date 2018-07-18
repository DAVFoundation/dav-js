import IConfig from './IConfig';

export default class Config implements IConfig {
    public ethNodeUrl?: string;
    public ttl?: number;
}
