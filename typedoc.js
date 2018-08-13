module.exports = {
  out: 'docs/api',
  module: 'commonjs',
  target: 'es6',
  name: 'DAV Network Javascript SDK',
  exclude: '**/*+(test|ContractsIntegrationSimulator|Kafka|Contracts|KafkaMessageStream).ts',
  excludeExternals: true,
};
