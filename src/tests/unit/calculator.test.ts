import { StockCalculator } from '../../services/calculator';

test('no historical data', () => {
  expect(StockCalculator.calculateBuySellDate([])).toBeUndefined();
})

test('simple case with gain', () => {
  const buyPt = { date: '5/20/22', price: 0 };
  const sellPt = { date: '5/21/22', price: 7 };
  const historicalData = [buyPt, sellPt];
  expect(StockCalculator.calculateBuySellDate(historicalData)).toStrictEqual({ buyPoint: buyPt, sellPoint: sellPt });
});

test('simple case with no gain', () => {
  const buyPt = { date: '5/20/22', price: 7 };
  const sellPt = { date: '5/21/22', price: 0 };
  const historicalData = [buyPt, sellPt];
  expect(StockCalculator.calculateBuySellDate(historicalData)).toBeUndefined();
});

test('decreasing series', () => {
  const day1 = { date: '5/20/22', price: 7 };
  const day2 = { date: '5/21/22', price: 6 };
  const day3 = { date: '5/22/22', price: 5 };
  const day4 = { date: '5/23/22', price: 4 };
  const day5 = { date: '5/24/22', price: 3 };
  const day6 = { date: '5/24/22', price: 2 };
  const historicalData = [day1, day2, day3, day4, day5, day6];
  expect(StockCalculator.calculateBuySellDate(historicalData)).toBeUndefined();
});

test('multiple buy sell dates - best buy time in middle of series', () => {
  const day1 = { date: '5/20/22', price: 1 };
  const day2 = { date: '5/21/22', price: 5 };
  const day3 = { date: '5/22/22', price: 5 };
  const day4 = { date: '5/23/22', price: 0 };
  const day5 = { date: '5/24/22', price: 6 };
  const day6 = { date: '5/24/22', price: 3 };
  const historicalData = [day1, day2, day3, day4, day5, day6];
  expect(StockCalculator.calculateBuySellDate(historicalData)).toStrictEqual({ buyPoint: day4, sellPoint: day5 });
});

test('multiple buy sell dates - best buy time somewhere in beginning of series', () => {
  const day1 = { date: '5/20/22', price: 7 };
  const day2 = { date: '5/21/22', price: 1 };
  const day3 = { date: '5/22/22', price: 5 };
  const day4 = { date: '5/23/22', price: 3 };
  const day5 = { date: '5/24/22', price: 6 };
  const day6 = { date: '5/24/22', price: 4 };
  const historicalData = [day1, day2, day3, day4, day5, day6];
  expect(StockCalculator.calculateBuySellDate(historicalData)).toStrictEqual({ buyPoint: day2, sellPoint: day5 });
});

test('multiple buy sell dates - best buy time somewhere end of series', () => {
  const day1 = { date: '5/20/22', price: 7 };
  const day2 = { date: '5/21/22', price: 1 };
  const day3 = { date: '5/22/22', price: 5 };
  const day4 = { date: '5/23/22', price: 3 };
  const day5 = { date: '5/24/22', price: 0 };
  const day6 = { date: '5/24/22', price: 8 };
  const historicalData = [day1, day2, day3, day4, day5, day6];
  expect(StockCalculator.calculateBuySellDate(historicalData)).toStrictEqual({ buyPoint: day5, sellPoint: day6 });
});