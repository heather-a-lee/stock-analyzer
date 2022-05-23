import request from 'supertest';
import nock from 'nock';
import app from '../../../src/app';
import { generateDataPoint } from '../mocks/mocks';

const accessKey = process.env.MARKET_STACK_API_KEY;

describe('test stocks route', () => {
  it('responds with an empty array when there is only one data point', async () => {
    const mockData = {
      pagination: {
        limit: 100,
        offset: 0,
        count: 1,
        total: 1,
      },
      data: [generateDataPoint(121.325, "2021-05-24")],
    };
    nock('http://api.marketstack.com').get(`/v1/eod?access_key=${accessKey}&symbols=SPLK&sort=ASC&offset=0`).reply(200, mockData);
    const response = await request(app).get('/v1/stocks/SPLK');
    expect(response.body).toEqual([]);
  });
  // test case with minimal data
  it('responds with an empty array for decreasing sequence', async () => {
    const mockData = {
      pagination: {
        limit: 100,
        offset: 0,
        count: 2,
        total: 2,
      },
      data: [generateDataPoint(100, "2021-05-24"), generateDataPoint(50, "2021-05-25")],
    };
    nock('http://api.marketstack.com').get(`/v1/eod?access_key=${accessKey}&symbols=SPLK&sort=ASC&offset=0`).reply(200, mockData);
    const response = await request(app).get('/v1/stocks/SPLK');
    expect(response.body).toEqual([]);
  });
  it('responds with pair of dates for simple case', async () => {
    const mockData = {
      pagination: {
        limit: 100,
        offset: 0,
        count: 2,
        total: 2,
      },
      data: [generateDataPoint(50, "2021-05-24"), generateDataPoint(100, "2021-05-25")],
    };
    nock('http://api.marketstack.com').get(`/v1/eod?access_key=${accessKey}&symbols=SPLK&sort=ASC&offset=0`).reply(200, mockData);
    const response = await request(app).get('/v1/stocks/SPLK');
    expect(response.body).toEqual(["2021-05-24", "2021-05-25"]);
  });
  it('responds with pair of dates for simple case', async () => {
    const mockData = {
      pagination: {
        limit: 100,
        offset: 0,
        count: 2,
        total: 2,
      },
      data: [generateDataPoint(50, "2021-05-24"), generateDataPoint(75, "2021-05-25"), generateDataPoint(100, "2021-05-26"), generateDataPoint(80, "2021-05-27")],
    };
    nock('http://api.marketstack.com').get(`/v1/eod?access_key=${accessKey}&symbols=SPLK&sort=ASC&offset=0`).reply(200, mockData);
    const response = await request(app).get('/v1/stocks/SPLK');
    expect(response.body).toEqual(["2021-05-24", "2021-05-26"]);
  });
  // test error handling
  it('responds with error code', async () => {
    nock('http://api.marketstack.com').get(`/v1/eod?access_key=${accessKey}&symbols=SPLK&sort=ASC&offset=0`).reply(422);
    const response = await request(app).get('/v1/stocks/FAKE');
    expect(response.statusCode).toEqual(500);
  });
});
