import KafkaMessageStream, { IKafkaMessage } from './KafkaMessageStream';
import { Observable } from './common-types';
import typesMap from './drone-delivery/ProtocolTypes';
import DroneDeliveryNeedParams from './drone-delivery/NeedParams';
import DroneDeliveryMissionParams from './drone-delivery/MissionParams';

describe('KafkaMessageStream', () => {

    it('should instantiate', () => {
        const kafkaStream = Observable.fromObservable(Observable.from([]), '');
        const message = new KafkaMessageStream(kafkaStream);
        expect(message).toBeDefined();
    });

    it('should instantiate filtered stream', () => {
        const kafkaStream = Observable.fromObservable(Observable.from([]), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(typesMap, typesMap.messages);
        expect(stream).toBeDefined();
    });

    it('should pass message', (done) => {
        expect.assertions(1);
        const kafkaMessages: IKafkaMessage[] = [
            { protocol: 'drone_delivery', type: 'need', contents: '{}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(typesMap, typesMap.needs);
        stream.subscribe(
            (need) => { expect(need).toBeDefined(); },
            (error) => { fail(error); done(); },
            () => { done(); });
    });

    it('should filter message', (done) => {
        const kafkaMessages: IKafkaMessage[] = [
            { protocol: 'drone_delivery', type: 'need', contents: '{}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(typesMap, typesMap.bids);
        stream.subscribe(
            (need) => { fail('No message should pass'); done(); },
            (error) => { fail(error); done(); },
            () => { done(); });
    });

    it('should filter first message and pass second when first is not correct type and second is', (done) => {
        expect.assertions(1);
        const kafkaMessages: IKafkaMessage[] = [
            { protocol: 'drone_delivery', type: 'not_need', contents:
            '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":"3000", "startAt":1}' },
            { protocol: 'drone_delivery', type: 'need', contents:
            '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":2}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(typesMap, typesMap.needs);
        const passedMessages: any[] = [];
        stream.subscribe(
            (need) => {
                passedMessages.push(need);
            },
            (error) => { fail(error); },
            () => {
                const formattedNeedParams = new DroneDeliveryNeedParams();
                formattedNeedParams.deserialize(JSON.parse('{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}'));
                expect(passedMessages).toMatchObject([formattedNeedParams]);
                done();
            });
    });

    it('should pass first message and filter second when first is correct type and second is not', (done) => {
        // expect.assertions(1);
        const kafkaMessages: IKafkaMessage[] = [
            { protocol: 'drone_delivery', type: 'need', contents:
            '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}' },
            { protocol: 'drone_delivery', type: 'not_need', contents:
            '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":2}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const stream = messageStream.filterType(typesMap, typesMap.needs);
        const passedMessages: any[] = [];
        stream.subscribe(
            (need) => {
                passedMessages.push(need);
            },
            (error) => { fail(error); },
            () => {
                const formattedNeedParams = new DroneDeliveryNeedParams();
                formattedNeedParams.deserialize(JSON.parse('{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}'));
                expect(passedMessages).toEqual([formattedNeedParams]);
                done();
            });
    });

    it('should pass each type to correct stream', (done) => {
        expect.assertions(2);
        const kafkaMessages: IKafkaMessage[] = [
            { protocol: 'drone_delivery', type: 'need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}' },
            { protocol: 'drone_delivery', type: 'mission', contents:
            '{"id":"1","price":{"type":"flat","value":"1000"},"vehicleId":"DAV_ID","neederDavId":"abc","protocol":"DroneDelivery","type":"Mission",' +
            ' "ttl":3000}' },
            { protocol: 'drone_delivery', type: 'need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":2}' },
            { protocol: 'drone_delivery', type: 'mission', contents:
            '{"id":"2","price":{"type":"flat","value":"1000"},"vehicleId":"DAV_ID","neederDavId":"abc","protocol":"DroneDelivery","type":"Mission",' +
            ' "ttl":3000}' },
        ];
        const kafkaStream = Observable.fromObservable(Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream(kafkaStream);
        const streamNeeds = messageStream.filterType(typesMap, typesMap.needs);
        const streamMissions = messageStream.filterType(typesMap, typesMap.missions);

        const passedNeeds: any[] = [];
        const passedMissions: any[] = [];
        let doneNeeds = false;
        let doneMissions = false;

        const test = () => {
            if (doneMissions && doneNeeds) {
                const formattedNeedParams1 = new DroneDeliveryNeedParams();
                formattedNeedParams1.deserialize(JSON.parse(kafkaMessages[0].contents));
                const formattedNeedParams2 = new DroneDeliveryNeedParams();
                formattedNeedParams2.deserialize(JSON.parse(kafkaMessages[2].contents));
                expect(passedNeeds).toEqual([formattedNeedParams1, formattedNeedParams2]);
                const expectedMission1 = new DroneDeliveryMissionParams();
                expectedMission1.deserialize(JSON.parse(kafkaMessages[1].contents));
                const expectedMission2 = new DroneDeliveryMissionParams();
                expectedMission2.deserialize(JSON.parse(kafkaMessages[3].contents));
                expect(passedMissions).toEqual([expectedMission1, expectedMission2]);
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

        streamMissions.subscribe(
            (bid) => {
                passedMissions.push(bid);
            },
            (error) => { fail(error); },
            () => {
                doneMissions = true;
                test();
            });
    });
});
