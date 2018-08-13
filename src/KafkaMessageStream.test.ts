import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';
import { Observable } from './common-types';
import DroneDeliveryNeedParams from './drone-delivery/NeedParams';
import DroneDeliveryBidParams from './drone-delivery/BidParams';

describe('KafkaMessageStream', () => {
    it('should instantiate', () => {
        const kafkaStream = Observable.fromObservable(Observable.from([]), '');
        const message = new KafkaMessageStream(kafkaStream);
        expect(message).toBeDefined();
    });

    it('should instantiate filtered stream', () => {
        const kafkaStream = Observable.fromObservable(Observable.from([]), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(DroneDeliveryNeedParams);
        expect(stream).toBeDefined();
    });

    it('should pass message', (done) => {
        expect.assertions(1);
        const kafkaMessages: IKafkaMessage[] = [
            { messageType: 'DroneDelivery:Need', contents: '{}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(DroneDeliveryNeedParams);
        stream.subscribe(
            (need) => { expect(need).toBeDefined(); },
            (error) => { fail(error); done(); },
            () => { done(); });
    });

    it('should filter message', (done) => {
        const kafkaMessages: IKafkaMessage[] = [
            { messageType: 'NOT_DroneDelivery:Need', contents: '{}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(DroneDeliveryNeedParams);
        stream.subscribe(
            (need) => { fail('No message should pass'); done(); },
            (error) => { fail(error); done(); },
            () => { done(); });
    });

    it('should filter first message and pass second when first is not correct type and second is', (done) => {
        expect.assertions(1);
        const kafkaMessages: IKafkaMessage[] = [
            { messageType: 'NOT_DroneDelivery:Need', contents: '{"startAt":1}' },
            { messageType: 'DroneDelivery:Need', contents: '{"startAt":2}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(DroneDeliveryNeedParams);
        const passedMessages: any[] = [];
        stream.subscribe(
            (need) => {
                passedMessages.push(need);
            },
            (error) => { fail(error); },
            () => {
                expect(passedMessages).toEqual([{ startAt: 2 }]);
                done();
            });
    });

    it('should pass first message and filter second when first is correct type and second is not', (done) => {
        expect.assertions(1);
        const kafkaMessages: IKafkaMessage[] = [
            { messageType: 'DroneDelivery:Need', contents: '{"startAt":1}' },
            { messageType: 'NOT_DroneDelivery:Need', contents: '{"startAt":2}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(DroneDeliveryNeedParams);
        const passedMessages: any[] = [];
        stream.subscribe(
            (need) => {
                passedMessages.push(need);
            },
            (error) => { fail(error); },
            () => {
                expect(passedMessages).toEqual([{ startAt: 1 }]);
                done();
            });
    });

    it('should pass each type to correct stream', (done) => {
        expect.assertions(2);
        const kafkaMessages: IKafkaMessage[] = [
            { messageType: 'DroneDelivery:Need', contents: '{"startAt":1}' },
            { messageType: 'DroneDelivery:Bid', contents: '{"name":"1","price":{"type":"flat","value":"1000"},"vehicleId":"DAV_ID"}' },
            { messageType: 'DroneDelivery:Need', contents: '{"startAt":2}' },
            { messageType: 'DroneDelivery:Bid', contents: '{"name":"2","price":{"type":"flat","value":"1000"},"vehicleId":"DAV_ID"}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const streamNeeds = messageStream.filterType(DroneDeliveryNeedParams);
        const streamBids = messageStream.filterType(DroneDeliveryBidParams);

        const passedNeeds: any[] = [];
        const passedBids: any[] = [];
        let doneNeeds = false;
        let doneBids = false;

        const test = () => {
            if (doneBids && doneNeeds) {
                expect(passedNeeds).toEqual([{ startAt: 1 }, { startAt: 2 }]);
                expect(passedBids).toEqual([
                    {
                        id: undefined, name: '1', needTypeId: undefined,
                        price: { description: undefined, type: 'flat', value: '1000' }, vehicleId: 'DAV_ID',
                    },
                    {
                        id: undefined, name: '2', needTypeId: undefined,
                        price: { description: undefined, type: 'flat', value: '1000' }, vehicleId: 'DAV_ID',
                    },
                ]);
                done();
            }
        };

        streamNeeds.subscribe(
            (need) => {
                passedNeeds.push(need);
            },
            (error) => { fail(error); },
            () => {
                doneNeeds = true;
                test();
            });

        streamBids.subscribe(
            (bid) => {
                passedBids.push(bid);
            },
            (error) => { fail(error); },
            () => {
                doneBids = true;
                test();
            });
    });
});
