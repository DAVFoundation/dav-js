export namespace Rx {
    export class Observable<T> {
      public subscribe(success: (t: T) => void, error?: (t: T) => void) { /**/ }
      public filter(cb: (t: T) => boolean): Observable<T> { return this; }
    }
} // Dummy Definition
export type ID = string;
export type BigInteger = string;
