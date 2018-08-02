import IConfig from '../IConfig';
import { Observable } from '../common-types';
import { Observer } from 'rxjs';
import BasicParams from '../BasicParams';

export default function KafkaFactory(callRes: any) {

    class Kafka {

        public static generateTopicId(): string {
            return callRes.generateTopicIdResolve;
        }

        public static async createTopic(topicId: string, config: IConfig): Promise<void> {
            if (callRes.createTopicReject) {
                return Promise.reject(callRes.createTopicReject);
            } else {
                return Promise.resolve(callRes.createTopicResolve);
            }
        }

        public static async sendParams(topicId: string, basicParams: BasicParams, config: IConfig) {
            if (callRes.sendParamsReject) {
                return Promise.reject(callRes.sendParamsReject);
            } else {
                return Promise.resolve(callRes.sendParamsResolve);
            }
        }

        public static async paramsStream<T extends BasicParams>(topicId: string, config: IConfig): Promise<Observable<T>> {
            Observable.create();
            const rxObservable = Observable.create((observer: Observer<T>) => {
                if (callRes.paramsStreamEvent) {
                    observer.next(callRes.paramsStreamEvent);
                } else {
                    observer.error(callRes.paramsStreamError);
                }
            });
            const bidParamsObservable = Observable.fromObservable<T>(rxObservable, topicId);
            return bidParamsObservable;
        }
    }

    return new Kafka();
}
