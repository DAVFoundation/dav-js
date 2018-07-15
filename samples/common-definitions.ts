namespace Rx {
    export class Subject<T> {
      public subscribe(success: (t: T) => void, error?: (t: T) => void) { /**/ }
      public filter(cb: (t: T) => boolean): Subject<T> { return this; }
    }
} // Dummy Definition
  
type ID = string;
type BigInteger = string;
