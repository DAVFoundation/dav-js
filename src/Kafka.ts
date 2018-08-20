
const runningOnBrowser = process.env.BROWSER || false;

// tslint:disable-next-line:variable-name
let Kafka: any;

const loadKafka = () => {
    if (runningOnBrowser) {
        Kafka = require('./KafkaApi').default;
    } else {
        Kafka = require('./KafkaNode').default;
    }
};
loadKafka();
export default Kafka;
