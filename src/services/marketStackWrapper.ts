import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  // for local + testing, we can use the API key as defined in the .env file
  // if we were to deploy this application, we could store this in Gitlab CI, or pull it from vault
  dotenv.config();
}

export type MarketStackTickerObject = {
  open: number;
  high: number;
  low: number,
  close: number;
  volume: number;
  adj_high: number;
  adj_low: number;
  adj_close: number;
  adj_open: number;
  adj_volume: number;
  split_factor: number;
  dividend: number;
  symbol: string;
  exchange: string;
  date: string;
};

export type MarketStackData = MarketStackTickerObject[];

class MarketStackWrapper {
  async requestAllData(ticker: string, sort = "ASC") {
    // This would be a great opportunity for caching, e.g. regis for high traffic applications
    let offset = 0;
    const response = await this.request(ticker, sort, offset);
    let pagination = response.pagination;
    let tickerData = [...response.data];
    offset = pagination.count;
    const { total } = pagination;
    while (offset < total) {
      const { data: d, pagination: p } = await this.request(ticker, sort, offset);
      tickerData = [...tickerData, ...d];
      pagination = p;
      offset += pagination.count;
    }
    return tickerData;
  }

  async request(ticker: string, sort = "ASC", offset = 0) {
    try {
      const params = {
        access_key: process.env.MARKET_STACK_API_KEY,
        symbols: ticker,
        sort,
        offset,
      };
      const { data } = await axios.get('http://api.marketstack.com/v1/eod', { params });
      return data;
    } catch (err) {
      if (err.response?.status === 422) throw new Error(`Invalid ticker ${ticker}`);
      throw err;
    }
  }

  /**
   * This function assumes that the daily high value is the price for that day. This isn't necessarily the case
   * and for larger scale applications we might get more granular (including the low for buy date, comparing to high on sell date).
   * @param tickerData
   * @returns array of {date: string, price: number}
   */
  formatData(tickerData: MarketStackData) {
    return tickerData.map(dataPoint => {
      const { date, high } = dataPoint;
      return { date, price: high };
    });
  }
}

export { MarketStackWrapper };