import {ID, PriceType, Rx, Mission, Message} from '../samples/core';

export interface IBid {
    id: ID;
    priceType: PriceType;
    price: number;

    // accept this bid, should be called by service consumer
    accept: () => void;
    signContract: (walletPrivateKey: string) => Promise<Mission>;
    messages: () => Rx.Observable<Message>;
  }
