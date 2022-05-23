type StockDataPoint = {
  date: string;
  price: number;
};
type StockDataPoints = StockDataPoint[];
type BuySellPoint = { buyPoint: StockDataPoint, sellPoint: StockDataPoint } | undefined;

export class StockCalculator {
  static calculateBuySellDate = (historicalData: StockDataPoints): BuySellPoint => {
    if (historicalData.length === 0) return undefined;
    let result;
    let maxGainSeen = 0;
    let buyPoint = historicalData[0];
    let sellPoint = historicalData[0];
    const potentialBuySellPairs: { [gain: number]: BuySellPoint } = {};
    historicalData.forEach(pt => {
      const potentialGain = pt.price - buyPoint.price;
      if (potentialGain > maxGainSeen) { // check if we can get bigger gains
        sellPoint = pt;
        maxGainSeen = potentialGain;
      } else if (pt.price < buyPoint.price) { // prefer long term gains over short term - no need to reset if the purchase price is the same price later on
        potentialBuySellPairs[maxGainSeen] = { buyPoint, sellPoint };
        buyPoint = pt;
        sellPoint = pt;
        maxGainSeen = 0; // have to reset sell point and maxGainSeen
      }
    });
    // log in dictionary after loop in case last day is a good sell date
    potentialBuySellPairs[maxGainSeen] = { buyPoint, sellPoint };
    let gain = 0;
    Object.entries(potentialBuySellPairs).forEach(([k, v]) => { // find the highest gain in the dictionary
      // made the assumption that we don't want to include a solution that has buy/sell date as the same day to get 0 gain
      if (Number(k) > gain) {
        result = v;
        gain = Number(k);
      }
    });
    return result;
  };
};