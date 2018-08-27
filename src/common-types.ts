import { Observable as RxObservable } from 'rxjs';
import { ContractTypes } from './common-enums';

/**
 * @type The type ID represent kafka topic id.
 */
export type ID = string;
/**
 * @type The type DavID represent DAV unique identity string.
 */
export type DavID = string;
/**
 * @type The type BigInteger represent a big number.
 */
export type BigInteger = string;
/**
 * @type The type ContractArtifacts represent the DAV Contracts artifacts that contain ABI and networks addresses.
 */
export type ContractsArtifacts = { [T in ContractTypes]: any };

/**
 * @type The Dimensions interface represents dimensions for service, (package dimensions, drone dimensions, boat dimensions, etc.).
 */
export interface IDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
  }

/**
 * @type The Location interface represents location which contains Latitude and Longitude.
 */
export interface ILocation {Lat: number; Long: number; }

/**
 * @type The type Observable represent the SDK observable object that used to subscribe to Needs/Bids/Messages/etc...
 */
export class Observable<T> extends RxObservable<T>  {
    public topic: ID;
    public static fromObservable<T>(observableRx: RxObservable<T>, topic: ID): Observable<T> {
        const observable = observableRx as Observable<T>;
        observable.topic = topic;
        return observable;
    }
    private constructor() { super(); }
}
