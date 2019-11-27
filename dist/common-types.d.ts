import { Observable as RxObservable } from 'rxjs';
import { ContractTypes } from './common-enums';
import IConfig from './IConfig';
import BasicParams from './BasicParams';
import KafkaMessageStream from './KafkaMessageStream';
/**
 * @type The type ID represent kafka topic id.
 */
export declare type ID = string;
/**
 * @type The type DavID represent DAV unique identity string.
 */
export declare type DavID = string;
/**
 * @type The type BigInteger represent a big number.
 */
export declare type BigInteger = string;
/**
 * @type The type ContractArtifacts represent the DAV Contracts artifacts that contain ABI and networks addresses.
 */
export declare type ContractsArtifacts = {
    [T in ContractTypes]: any;
};
/**
 * @type The Dimensions interface represents dimensions for service, (package dimensions, drone dimensions, vessel dimensions, etc.).
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
export interface ILocation {
    lat: number;
    long: number;
}
export interface IKafka {
    generateTopicId(): string;
    createTopic(topicId: string, config: IConfig): Promise<void>;
    sendParams(topicId: string, basicParams: BasicParams, config: IConfig): Promise<void>;
    messages(topicId: string, config: IConfig): Promise<KafkaMessageStream>;
}
/**
 * @type The type Observable represent the SDK observable object that used to subscribe to Needs/Bids/Messages/etc...
 */
export declare class Observable<T> extends RxObservable<T> {
    topic: ID;
    static fromObservable<T>(observableRx: RxObservable<T>, topic: ID): Observable<T>;
    private constructor();
}
