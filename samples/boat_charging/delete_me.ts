import Config from '../../src/Config';
import Kafka from '../../src/KafkaNode';
import BaseParams from '../../src/boat-charging/NeedParams';
const sdkConfiguration = {
    apiSeedUrls: ['http://localhost'],
    kafkaSeedUrls: ['localhost:9092'],
  };

const config = new Config(sdkConfiguration);
const params = new BaseParams({});

Kafka.sendParams('b871c693-b3e2-470b-8419-27cadff4871b', params, config);
