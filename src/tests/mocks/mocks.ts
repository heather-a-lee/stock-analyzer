import { MarketStackTickerObject } from "../../services/marketStackWrapper";

export const generateDataPoint = (price: number, date: string): MarketStackTickerObject => {
  return {
    open: null,
    high: price,
    low: null,
    close: null,
    volume: null,
    adj_high: null,
    adj_low: null,
    adj_close: null,
    adj_open: null,
    adj_volume: null,
    split_factor: 1,
    dividend: 0,
    symbol: "SPLK",
    exchange: "XNAS",
    date,
  };
};