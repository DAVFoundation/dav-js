import runProvider from './driver';
import runConsumer from './passenger';

const sdkConfiguration = {
    apiSeedUrls: ['http://localhost'],
    kafkaSeedUrls: ['localhost:9092'],
  };

runProvider(sdkConfiguration);
runConsumer(sdkConfiguration);
