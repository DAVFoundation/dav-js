"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KafkaMessageStream_1 = require("./KafkaMessageStream");
const common_types_1 = require("./common-types");
const ProtocolTypes_1 = require("./drone-delivery/ProtocolTypes");
const NeedParams_1 = require("./drone-delivery/NeedParams");
const MissionParams_1 = require("./drone-delivery/MissionParams");
describe('KafkaMessageStream', () => {
    it('should instantiate', () => {
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from([]), '');
        const message = new KafkaMessageStream_1.default(kafkaStream);
        expect(message).toBeDefined();
    });
    it('should instantiate filtered stream', () => {
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from([]), '');
        const messageStream = new KafkaMessageStream_1.default(kafkaStream);
        const stream = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.messages);
        expect(stream).toBeDefined();
    });
    it('should pass message', (done) => {
        expect.assertions(1);
        const kafkaMessages = [
            { protocol: 'drone_delivery', type: 'need', contents: '{}' },
        ];
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream_1.default(kafkaStream);
        const stream = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.needs);
        stream.subscribe((need) => { expect(need).toBeDefined(); }, (error) => { fail(error); done(); }, () => { done(); });
    });
    it('should filter message', (done) => {
        const kafkaMessages = [
            { protocol: 'drone_delivery', type: 'need', contents: '{}' },
        ];
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream_1.default(kafkaStream);
        const stream = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.bids);
        stream.subscribe((need) => { fail('No message should pass'); done(); }, (error) => { fail(error); done(); }, () => { done(); });
    });
    it('should filter first message and pass second when first is not correct type and second is', (done) => {
        expect.assertions(1);
        const kafkaMessages = [
            { protocol: 'drone_delivery', type: 'not_need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":"3000", "startAt":1}' },
            { protocol: 'drone_delivery', type: 'need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":2}' },
        ];
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream_1.default(kafkaStream);
        const stream = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.needs);
        const passedMessages = [];
        stream.subscribe((need) => {
            passedMessages.push(need);
        }, (error) => { fail(error); }, () => {
            const formattedNeedParams = new NeedParams_1.default();
            formattedNeedParams.deserialize(JSON.parse('{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}'));
            expect(passedMessages).toMatchObject([formattedNeedParams]);
            done();
        });
    });
    it('should pass first message and filter second when first is correct type and second is not', (done) => {
        // expect.assertions(1);
        const kafkaMessages = [
            { protocol: 'drone_delivery', type: 'need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}' },
            { protocol: 'drone_delivery', type: 'not_need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":2}' },
        ];
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream_1.default(kafkaStream);
        const stream = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.needs);
        const passedMessages = [];
        stream.subscribe((need) => {
            passedMessages.push(need);
        }, (error) => { fail(error); }, () => {
            const formattedNeedParams = new NeedParams_1.default();
            formattedNeedParams.deserialize(JSON.parse('{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}'));
            expect(passedMessages).toEqual([formattedNeedParams]);
            done();
        });
    });
    it('should pass each type to correct stream', (done) => {
        expect.assertions(2);
        const kafkaMessages = [
            { protocol: 'drone_delivery', type: 'need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":1}' },
            { protocol: 'drone_delivery', type: 'mission', contents: '{"id":"1","price":{"type":"flat","value":"1000"},"vehicleId":"DAV_ID","neederDavId":"abc","protocol":"DroneDelivery","type":"Mission",' +
                    ' "ttl":3000}' },
            { protocol: 'drone_delivery', type: 'need', contents: '{"id":"123", "protocol":"DroneDelivery", "type":"Bid", "ttl":3000, "startAt":2}' },
            { protocol: 'drone_delivery', type: 'mission', contents: '{"id":"2","price":{"type":"flat","value":"1000"},"vehicleId":"DAV_ID","neederDavId":"abc","protocol":"DroneDelivery","type":"Mission",' +
                    ' "ttl":3000}' },
        ];
        const kafkaStream = common_types_1.Observable.fromObservable(common_types_1.Observable.from(kafkaMessages), '');
        const messageStream = new KafkaMessageStream_1.default(kafkaStream);
        const streamNeeds = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.needs);
        const streamMissions = messageStream.filterType(ProtocolTypes_1.default, ProtocolTypes_1.default.missions);
        const passedNeeds = [];
        const passedMissions = [];
        let doneNeeds = false;
        let doneMissions = false;
        const test = () => {
            if (doneMissions && doneNeeds) {
                const formattedNeedParams1 = new NeedParams_1.default();
                formattedNeedParams1.deserialize(JSON.parse(kafkaMessages[0].contents));
                const formattedNeedParams2 = new NeedParams_1.default();
                formattedNeedParams2.deserialize(JSON.parse(kafkaMessages[2].contents));
                expect(passedNeeds).toEqual([formattedNeedParams1, formattedNeedParams2]);
                const expectedMission1 = new MissionParams_1.default();
                expectedMission1.deserialize(JSON.parse(kafkaMessages[1].contents));
                const expectedMission2 = new MissionParams_1.default();
                expectedMission2.deserialize(JSON.parse(kafkaMessages[3].contents));
                expect(passedMissions).toEqual([expectedMission1, expectedMission2]);
                done();
            }
        };
        streamNeeds.subscribe((need) => {
            passedNeeds.push(need);
        }, (error) => { fail(error); }, () => {
            doneNeeds = true;
            test();
        });
        streamMissions.subscribe((bid) => {
            passedMissions.push(bid);
        }, (error) => { fail(error); }, () => {
            doneMissions = true;
            test();
        });
    });
});

//# sourceMappingURL=KafkaMessageStream.test.js.map
