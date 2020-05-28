import * as chai from 'chai';
import * as sinonChai from 'sinon-chai';
import * as sinon from 'sinon';
import { ServiceDataProvider } from '../../src/tree/serviceDataProvider';
import * as singleServiceData from './singleServiceServiceList.json';
import * as singleServiceRevisionData from './singleServiceRevisionList.json';
import { KnativeTreeItem } from '../../src/tree/knativeTreeItem';
import { ContextType } from '../../src/kn/config';
import { KnativeItem } from '../../src/knative/knativeItem';
import { Service } from '../../src/knative/service';
import { Revision } from '../../src/knative/revision';

const { expect } = chai;
chai.use(sinonChai);

suite('ServiceDataProvider', () => {
  const sandbox = sinon.createSandbox();
  const serviceDataProvider = new ServiceDataProvider();

  teardown(() => {
    sandbox.restore();
  });
  suite('No Services', () => {
    test('getChildren should return the No Services node when KN execute returns "No Services found"', async () => {
      sandbox.stub(serviceDataProvider.knExecutor, 'execute').resolves({ error: undefined, stdout: 'No services found.' });
      const result = await serviceDataProvider.getChildren();
      expect(result).to.have.lengthOf(1);
      expect(result[0].description).equals('');
      expect(result[0].label).equals('No Service Found');
      expect(result[0].getName()).equals('No Service Found');
    });
  });

  suite('Single service', () => {
    test('getChildren should return single node', async () => {
      sandbox
        .stub(serviceDataProvider.knExecutor, 'execute')
        .resolves({ error: undefined, stdout: JSON.stringify(singleServiceData) });
      const result = await serviceDataProvider.getChildren();
      expect(result).to.have.lengthOf(1);
      expect(result[0].description).equals('');
      expect(result[0].label).equals('greeter');
      expect(result[0].getName()).equals('greeter');
      expect(result[0].tooltip).equals('Service: greeter');
    });
  });

  suite('Single revision', () => {
    test('getChildren should return single node', async () => {
      sandbox
        .stub(serviceDataProvider.knExecutor, 'execute')
        .resolves({ error: undefined, stdout: JSON.stringify(singleServiceRevisionData) });
      const parentKnativeItem: KnativeItem = new Service('greeter', 'quay.io/rhdevelopers/knative-tutorial-greeter:quarkus');
      const parent: KnativeTreeItem = new KnativeTreeItem(null, parentKnativeItem, 'greeter', ContextType.SERVICE, 0, null, null);
      const result = await serviceDataProvider.getChildren(parent);
      expect(result).to.have.lengthOf(1);
      expect(result[0].description).equals('');
      expect(result[0].label).equals('greeter-btrnq-1');
      expect(result[0].getName()).equals('greeter-btrnq-1');
      expect(result[0].tooltip).equals('Revision: greeter-btrnq-1');
    });
  });
});