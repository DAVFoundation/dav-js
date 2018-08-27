import runProvider from './driver';
import runConsumer from './passenger';
import Config from '../../src/Config';

const sdkConfiguration = {
    apiSeedUrls: ['http://localhost'],
    kafkaSeedUrls: ['localhost:9092'],
  };
const config = new Config(sdkConfiguration);
runProvider(config);
setTimeout(() => runConsumer(config), 1000);
