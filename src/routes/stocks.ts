import express from 'express';
import { MarketStackWrapper } from '../services/marketStackWrapper';
import { StockCalculator } from '../services/calculator';

const router = express.Router();

export type StockResponse = [
  buyDate: string,
  sellDate: string,
];

/* GET stocks listing. */
router.get('/:ticker', async (req, res) => {
  try {
    const { ticker } = req.params; // assume ticker value is always valid, we could cross check
    const marketStackWrapper = new MarketStackWrapper();
    const aggregatedTickerData = await marketStackWrapper.requestAllData(ticker);
    const historicalData = marketStackWrapper.formatData(aggregatedTickerData);
    const result = StockCalculator.calculateBuySellDate(historicalData);
    if (!result) return res.json([]);
    return res.json([result.buyPoint.date, result.sellPoint.date] as StockResponse);
  } catch (err) {
    return res.status(500).json({ error: `Error getting buy/sell date: ${err.message}`});
  }
});

export default router;