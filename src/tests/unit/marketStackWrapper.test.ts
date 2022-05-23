import { MarketStackWrapper } from '../../services/marketStackWrapper';
import { back as nockBack } from 'nock';
import path from 'path';

nockBack.fixtures = path.join(__dirname, '__nock-fixtures__');
nockBack.setMode('record');

test('test logic for invalid ticker', async () => {
  const { nockDone } = await nockBack('getInvalidTicker.json');
  const marketStackWrapper = new MarketStackWrapper();
  await expect(marketStackWrapper.requestAllData('APPL')).rejects.toThrowError(`Invalid ticker APPL`);
  nockDone();
});

test('test pagination logic - returns 252 items', async () => {
  const { nockDone } = await nockBack('getSplunkData.json');
  const marketStackWrapper = new MarketStackWrapper();
  const data = await marketStackWrapper.requestAllData('SPLK');
  expect(data.length).toEqual(252);
  const formatted = marketStackWrapper.formatData(data);
  formatted.forEach(d => {
    expect(d.date).toBeDefined();
    expect(d.price).toBeDefined();
  });
  nockDone();
});
