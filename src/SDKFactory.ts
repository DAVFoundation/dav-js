import IConfig from './IConfig';
import Config from './Config';
import SDK from './SDK';

export default function SDKFactory(config: IConfig): SDK {
    const configuration = new Config(config);
    return new SDK(configuration);
}
