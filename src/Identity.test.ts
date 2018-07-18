import Config from './Config';
import Identity from './Identity';
import NeedFilterParams from './drone-charging/NeedFilterParams';
import NeedParams from './drone-charging/NeedParams';

describe('Identity class', () => {
    const config = new Config();
    const needFilterParams = new NeedFilterParams({area: {lat: 0, long: 0, radius: 0}});
    const needParams = new NeedParams({});

    beforeAll(() => { /**/ });

    describe('needsForType method', () => {
      beforeAll(() => { /**/ });

      it('should success, validate kafka mock create topic', async () => {
        const identity = new Identity('id', 'davId', config);
        const needsStream = identity.needsForType(needFilterParams);
        // check kafka mock create topic method to be called with valid topic
      });

      it('should fail due to topic creation failure', async () => {
        const identity = new Identity('id', 'davId', config);
        expect(identity.needsForType(needFilterParams)).toThrow('topic creation error');
      });

      it('should fail due to dav node exception', async () => {
        const identity = new Identity('id', 'davId', config);
        expect(identity.needsForType(needFilterParams)).toThrow('dav node exception');
      });
    });

    describe('publishNeed method', () => {
        beforeAll(() => { /**/ });

        it('should success, validate kafka mock create topic', async () => {
          const identity = new Identity('id', 'davId', config);
          const need = identity.publishNeed(needParams);
          // check kafka mock create topic method to be called with valid topic
        });

        it('should success, validate need', async () => {
            const identity = new Identity('id', 'davId', config);
            const need = identity.publishNeed(needParams);
            // check each need public property validity in a separate test
          });

        it('should fail due to topic creation failure', async () => {
          const identity = new Identity('id', 'davId', config);
          expect(identity.publishNeed(needParams)).toThrow('topic creation error');
        });

        it('should fail due to dav node exception', async () => {
          const identity = new Identity('id', 'davId', config);
          expect(identity.publishNeed(needParams)).toThrow('dav node exception');
        });
    });

    describe('need method', () => {
        beforeAll(() => { /**/ });

        it('should success, validate need', async () => {
          const identity = new Identity('id', 'davId', config);
          const need = identity.need('needId');
          // check each need public property validity in a separate test
        });
    });

    describe('bid method', () => {
        beforeAll(() => { /**/ });

        it('should success, validate bid', async () => {
          const identity = new Identity('id', 'davId', config);
          const bid = identity.bid('bidId');
          // check each bid public property validity in a separate test
        });
    });

    describe('mission method', () => {
        beforeAll(() => { /**/ });

        it('should success, validate mission', async () => {
            const identity = new Identity('id', 'davId', config);
            const mission = identity.mission('missionId', 'peerId');
            // check each mission public property validity in a separate test
        });
    });

    describe('messages method', () => {
        beforeAll(() => { /**/ });

        it('should success', async () => {
            const identity = new Identity('id', 'davId', config);
            const messages = identity.messages();
        });
    });
});
