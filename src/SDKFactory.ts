import IConfig from './IConfig';
import SDK from './SDK';

export default function SDKFactory(config: IConfig): SDK {
    return new SDK(config);
}
