import { IKafka } from './common-types';

const runningOnBrowser = process.env.BROWSER || false;

// tslint:disable-next-line:variable-name
let Kafka: IKafka;

const loadKafka = () => {
    if (runningOnBrowser) {
        Kafka = new (require('./KafkaApi').default)();
    } else {
        Kafka = new (require('./KafkaNode').default)();
    }
};
loadKafka();
export default Kafka;
