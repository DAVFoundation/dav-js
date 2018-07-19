import IConfig from './IConfig';

export default class Config implements IConfig {

    constructor(props: Partial<IConfig>) {
        Object.assign(
            this,
            {
                ethNodeUrl: 'https://ropsten.infura.io/wUiZtmeZ1KwjFrcC8zRO',
                networkSeedUrls: [''],
                identityTtl: 10000,
                needTypeTtl: 10000,
                needTtl: 10000,
                missionConsumerTtl: 10000,
                missionProviderTtl: 10000,
            },
            props);
    }
}
