import { Observable as RxObservable } from 'rxjs/Rx';

export type ID = string;
export type DavID = string;
export type BigInteger = string;

export class Observable<T> extends RxObservable<T> {
    public topic: ID;
}
