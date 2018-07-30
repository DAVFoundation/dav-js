import Config from './Config';
import Identity from './Identity';
import NeedFilterParams from './drone-charging/NeedFilterParams';
import NeedParams from './drone-charging/NeedParams';
import BidParams from './drone-charging/BidParams';

describe('Identity class', () => {
    const config = new Config({});
    const needFilterParams = new NeedFilterParams({area: {lat: 0, long: 0, radius: 0}});
    const needParams = new NeedParams({});
    const bidParams = new BidParams({});

    beforeAll(() => { /**/ });

    describe('needsForType method', () => {
      beforeAll(() => { /**/ });

      xit('should success, validate kafka mock create topic', async () => {
        const identity = new Identity('id', 'davId', config);
        const needsStream = await identity.needsForType(needFilterParams);
        // check kafka mock create topic method to be called with valid topic
      });

      xit('should fail due to topic creation failure', async () => {
        const identity = new Identity('id', 'davId', config);
        expect(await identity.needsForType(needFilterParams)).toThrow('topic creation error');
      });

      xit('should fail due to dav node exception', async () => {
        const identity = new Identity('id', 'davId', config);
        expect(await identity.needsForType(needFilterParams)).toThrow('dav node exception');
      });
    });

    describe('publishNeed method', () => {
        beforeAll(() => { /**/ });

        xit('should success, validate kafka mock create topic', async () => {
          const identity = new Identity('id', 'davId', config);
          const need = await identity.publishNeed(needParams);
          // check kafka mock create topic method to be called with valid topic
        });

        xit('should success, validate need', async () => {
            const identity = new Identity('id', 'davId', config);
            const need = await identity.publishNeed(needParams);
            // check each need public property validity in a separate test
          });

        xit('should fail due to topic creation failure', async () => {
          const identity = new Identity('id', 'davId', config);
          expect(await identity.publishNeed(needParams)).toThrow('topic creation error');
        });

        xit('should fail due to dav node exception', async () => {
          const identity = new Identity('id', 'davId', config);
          expect(await identity.publishNeed(needParams)).toThrow('dav node exception');
        });
    });

    describe('need method', () => {
        beforeAll(() => { /**/ });

        xit('should success, validate need', () => {
          const identity = new Identity('id', 'davId', config);
          const need = identity.need('needId', needParams);
          // check each need public property validity in a separate test
        });
    });

    describe('bid method', () => {
        beforeAll(() => { /**/ });

        xit('should success, validate bid', () => {
          const identity = new Identity('id', 'davId', config);
          const bid = identity.bid('bidId', bidParams);
          // check each bid public property validity in a separate test
        });
    });

    describe('mission method', () => {
        beforeAll(() => { /**/ });

        xit('should success, validate mission', () => {
            const identity = new Identity('id', 'davId', config);
            const mission = identity.mission('missionId', 'peerId');
            // check each mission public property validity in a separate test
        });
    });

    describe('messages method', () => {
        beforeAll(() => { /**/ });

        xit('should success', () => {
            const identity = new Identity('id', 'davId', config);
            const messages = identity.messages();
        });
    });
});
