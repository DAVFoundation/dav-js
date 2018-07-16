import { Observable as RxObservable } from 'rxjs/Rx';

export type TopicID = string;
export type ID = string;
export type BigInteger = string;

export class Observable<T> extends RxObservable<T> {
    public topic: TopicID;
}
