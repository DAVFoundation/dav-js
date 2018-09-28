import Config from '../../src/Config';

process.env.SDK_DEBUG_LOG = 'true';

export default new Config({
  apiSeedUrls: ['http://localhost:8080'],
  kafkaSeedUrls: ['localhost:9092'],
});
