import Config from './Config';
import IConfig from './IConfig';
import Need from './Need';
import NeedFilterParams from './vessel-charging/NeedFilterParams';
import NeedParams from './vessel-charging/NeedParams';
import MissionParams from './vessel-charging/MissionParams';
import MessageParams from './vessel-charging/messages/StatusRequestMessageParams';
import BidParams from './vessel-charging/BidParams';
import { Observable, ID } from './common-types';
import Message from './Message';
import Mission from './Mission';
import Bid from './Bid';

describe('Identity class', () => {

  const TOPIC_ID = 'TOPIC_ID';
  const kafkaError = { msg: 'Kafka error' };
  const davNodeError = { msg: 'Dav node error' };
  const config = new Config({}) as IConfig;
  const needFilterParams = new NeedFilterParams({ location: { lat: 10, long: 10 }, radius: 1000 });
  const needParams = new NeedParams({
    location: {
      lat: 32.050382,
      long: 34.766149,
    },
  });
  const bidParams = new BidParams({
    vehicleId: 'DAV_ID',
    availableFrom: Date.now(),
    price: '100',
  });
  const missionParams = new MissionParams({
    id: 'MISSION_ID',
    neederDavId: 'DAV_ID',
    vehicleId: 'DAV_ID',
    price: '100',
  });

  const forContextSwitch = () => {
    return new Promise((resolve, reject) => {
      jest.useRealTimers();
      setTimeout(resolve, 0);
      jest.useFakeTimers();
    });
  };

  describe('publishNeed method', () => {

    const kafkaMock = {
      generateTopicId: jest.fn(() => TOPIC_ID),
      createTopic: jest.fn(() => Promise.resolve()),
    };

    const axiosMock = {
      post: jest.fn(() => Promise.resolve()),
    };

    beforeAll(() => {
      jest.doMock('./Kafka', () => ({
        default: kafkaMock,
      }));
      jest.doMock('axios', () => ({
        default: axiosMock,
      }));
    });

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should call relevant functions and return valid need', async () => {
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('id', 'davId', config);
      const need = new Need(TOPIC_ID, needParams, config);
      await expect(identity.publishNeed(needParams)).resolves.toEqual(need);
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
      expect(axiosMock.post).toHaveBeenCalled();
      expect(axiosMock.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/publishNeed/${TOPIC_ID}`, needParams.serialize());
    });

    it('should fail due to dav node exception', async () => {
      axiosMock.post.mockImplementation(() => Promise.reject(davNodeError));
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('id', 'davId', config);
      await expect(identity.publishNeed(needParams)).rejects.toThrow(`Fail to publish need: ${davNodeError}`);
    });

    it('should fail due to topic creation failure', async () => {
      kafkaMock.createTopic.mockImplementation(() => Promise.reject(kafkaError));
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('id', 'davId', config);
      await expect(identity.publishNeed(needParams)).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
      expect(axiosMock.post).not.toHaveBeenCalled();
    });

  });

  describe('needsForType method', () => {

    const needParams1 = new NeedParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
    });
    const needParams2 = new NeedParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
    });
    const needParams3 = new NeedParams({
      location: {
        lat: 32.050382,
        long: 34.766149,
      },
    });

    const axiosMock = {
      post: jest.fn(() => Promise.resolve()),
    };

    beforeAll(() => {
      jest.doMock('axios', () => ({
        default: axiosMock,
      }));
    });

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.resetModules();
    });

    it('should receive needs and relevant functions', async () => {
      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([needParams1,  needParams2, needParams3])),
      };
      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const spy = jest.fn();
      const needs = await identity.needsForType(needFilterParams, NeedParams);
      needs.subscribe(spy);
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Need(TOPIC_ID, needParams1, config));
      expect(spy.mock.calls[1][0]).toEqual(new Need(TOPIC_ID, needParams2, config));
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
      expect(axiosMock.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
  });

    // xit('should receive Kafka error event', async () => {
    //   kafkaMock.paramsStream.mockImplementation(() => Observable.fromPromise(Promise.reject(kafkaError)));
    //   // tslint:disable-next-line:variable-name
    //   const Identity: any = (await import('./Identity')).default;
    //   const identity = new Identity('selfId', 'davId', config);
    //   const successSpy = jest.fn();
    //   const errorSpy = jest.fn();
    //   const needs = await identity.needsForType(needFilterParams, NeedParams);
    //   needs.subscribe(successSpy, errorSpy);
    //   await forContextSwitch();
    //   expect(successSpy.mock.calls.length).toBe(0);
    //   expect(errorSpy.mock.calls.length).toBe(1);
    //   expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
    //   expect(kafkaMock.generateTopicId).toHaveBeenCalled();
    //   expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
    //   expect(axiosMock.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
    // });

    it('should fail due to dav node exception', async () => {

      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      axiosMock.post.mockImplementation(() => Promise.reject(davNodeError));
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      await expect(identity.needsForType(needFilterParams, NeedParams)).rejects.toThrow(`Needs registration failed: ${davNodeError}`);
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
      expect(axiosMock.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
    });

    xit('should fail due to topic creation failure', async () => {
      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      kafkaMock.createTopic.mockImplementation(() => Promise.reject(kafkaError));
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      await expect(identity.needsForType(needFilterParams, NeedParams)).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
      expect(axiosMock.post).toHaveBeenCalledWith(`${config.apiSeedUrls[0]}/needsForType/${TOPIC_ID}`, needFilterParams.serialize());
    });

  });


  xdescribe('missions method', () => {

    const missionParams1 = new MissionParams({
      id: 'MISSION_ID_1',
      neederDavId: 'DAV_ID',
      vehicleId: 'DAV_ID',
      price: '100',
    });
    const missionParams2 = new MissionParams({
      id: 'MISSION_ID_2',
      neederDavId: 'DAV_ID',
      vehicleId: 'DAV_ID',
      price: '100',
    });
    const missionParams3 = new MissionParams({
      id: 'MISSION_ID_3',
      neederDavId: 'DAV_ID',
      vehicleId: 'DAV_ID',
      price: '100',
    });

    const axiosMock = {
      post: jest.fn(() => Promise.resolve()),
    };

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.resetModules();
      jest.doMock('axios', () => ({
        default: axiosMock,
      }));
    });

    it('should receive missions and relevant functions', async () => {

      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([missionParams1,  missionParams2, missionParams3])),
      };
      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const spy = jest.fn();
      const missions = await identity.missions(MissionParams);
      missions.subscribe(spy);
      await forContextSwitch();
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Mission(TOPIC_ID, missionParams1.id, missionParams1, config));
      expect(spy.mock.calls[1][0]).toEqual(new Mission(TOPIC_ID, missionParams2.id, missionParams2, config));
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
    });


    it('should receive missions with specified topicId and relevant functions', async () => {

      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([missionParams1,  missionParams2, missionParams3])),
      };
      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.resolve()),
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      const anotherTopic = 'anotherTopic';
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const spy = jest.fn();
      const missions = await identity.missions(MissionParams, anotherTopic);
      missions.subscribe(spy);
      await forContextSwitch();
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Mission(anotherTopic, missionParams1.id, missionParams1, config));
      expect(spy.mock.calls[1][0]).toEqual(new Mission(anotherTopic, missionParams2.id, missionParams2, config));
      expect(kafkaMock.generateTopicId).not.toHaveBeenCalled();
      expect(kafkaMock.createTopic).not.toHaveBeenCalled();
    });

    xit('should receive Kafka error event', async () => {
      // kafkaMock.paramsStream.mockImplementation(() => Promise.resolve(Observable.fromPromise(Promise.reject(kafkaError))));
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const successSpy = jest.fn();
      const errorSpy = jest.fn();
      const missions = await identity.missions();
      missions.subscribe(successSpy, errorSpy);
      await forContextSwitch();
      expect(successSpy.mock.calls.length).toBe(0);
      expect(errorSpy.mock.calls.length).toBe(1);
      expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
    });

    it('should fail due to topic creation failure', async () => {

      const kafkaMock = {
        generateTopicId: jest.fn(() => TOPIC_ID),
        createTopic: jest.fn(() => Promise.reject(kafkaError)),
        messages: jest.fn(),
      };
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      await forContextSwitch();
      await expect(identity.missions()).rejects.toThrow(`Fail to create a topic: ${kafkaError}`);
      expect(kafkaMock.generateTopicId).toHaveBeenCalled();
      expect(kafkaMock.createTopic).toHaveBeenCalledWith(TOPIC_ID, config);
      expect(kafkaMock.messages).not.toHaveBeenCalled();
    });

  });

  describe('need method', () => {
    beforeAll(() => { /**/ });

    it('should success, validate need', async () => {
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const need = identity.need(needParams);
      expect(need).toEqual(new Need(needParams.id, needParams, config));
    });
  });

  describe('bid method', () => {
    beforeAll(() => { /**/ });

    it('should success, validate bid', async () => {
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const bid = identity.bid('bidId', bidParams);
      expect(bid).toEqual(new Bid('bidId', bidParams, config));
    });
  });

  describe('mission method', () => {
    beforeAll(() => { /**/ });

    it('should success, validate mission', async () => {
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const mission = identity.mission('missionSelfId', 'missionPeerId', missionParams);
      expect(mission).toEqual(new Mission('missionSelfId', 'missionPeerId', missionParams, config));
    });
  });

  describe('messages method', () => {

    const axiosMock = {
      post: jest.fn(() => Promise.resolve()),
    };

    beforeAll(() => {
      jest.doMock('axios', () => ({
        default: axiosMock,
      }));
    });

    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      jest.resetModules();
    });

    xit('should receive message events', async () => {

      const messageParams1 = new MessageParams({ senderId: 'SOURCE_ID_1' });
      const messageParams2 = new MessageParams({ senderId: 'SOURCE_ID_2' });
      const messageParams3 = new MessageParams({ senderId: 'SOURCE_ID_3' });

      const kafkaMessageStreamMock = {
        filterType: jest.fn(() => Observable.from([messageParams1,  messageParams2, messageParams3])),
      };
      const kafkaMock = {
        messages: jest.fn(() => Promise.resolve(kafkaMessageStreamMock)),
      };
      jest.doMock('./KafkaMessageStream', () => ({
        default: jest.fn().mockImplementation(() => kafkaMessageStreamMock),
      }));
      jest.doMock('./Kafka', () => ({ default: kafkaMock }));

      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const spy = jest.fn();
      const messages = await identity.messages(MessageParams);
      messages.subscribe(spy);
      expect(spy.mock.calls.length).toBe(3);
      expect(spy.mock.calls[0][0]).toEqual(new Message('selfId', messageParams1, config));
      expect(spy.mock.calls[1][0]).toEqual(new Message('selfId', messageParams2, config));
      expect(spy.mock.calls[2][0]).toEqual(new Message('selfId', messageParams3, config));
    });


    xit('should receive error event', async () => {
      // kafkaMock.paramsStream.mockImplementation(() => Promise.resolve(Observable.fromPromise(Promise.reject(kafkaError))));
      // tslint:disable-next-line:variable-name
      const Identity: any = (await import('./Identity')).default;
      const identity = new Identity('selfId', 'davId', config);
      const successSpy = jest.fn();
      const errorSpy = jest.fn();
      const messages = await identity.messages();
      messages.subscribe(successSpy, errorSpy);
      await forContextSwitch();
      expect(successSpy.mock.calls.length).toBe(0);
      expect(errorSpy).toHaveBeenCalled();
      expect(errorSpy.mock.calls[0][0]).toBe(kafkaError);
    });

  });

});
