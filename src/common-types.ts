import { Observable as RxObservable } from 'rxjs';
import { ContractTypes } from './common-enums';

export type ID = string;
export type DavID = string;
export type BigInteger = string;
export type ConstructsArtifacts = { [T in ContractTypes]: any };
export class Observable<T> extends RxObservable<T>  {
    public topic: ID;
    public static fromObservable<T>(observableRx: RxObservable<T>, topic: ID): Observable<T> {
        const observable = observableRx as Observable<T>;
        observable.topic = topic;
        return observable;
    }
    private constructor() { super(); }
}
