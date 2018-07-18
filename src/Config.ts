import IConfig from './IConfig';

export default class Config implements IConfig {

    constructor(public ethNodeUrl?: string, public ttl?: number) {
        this.ethNodeUrl = ethNodeUrl || 'https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO';
        this.ttl = ttl || 10000;
    }
}
