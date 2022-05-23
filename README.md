## Stock Analyzer

Thanks for taking the time to review my submission! 😊

This is a web server which exposes a single API endpoint:
`/v1/stocks/:ticker`. Given a ticker symbol, the endpoint returns a JSON array containing two elements representing a buy and sell date that will yield the maximum profit over 365 days. This application makes outbound requests to [the MarketStack API](https://marketstack.com/documentation).

### Pre-requisites
- Add a .env file. The contents should be `MARKET_STACK_API_KEY=<API_KEY FROM PASTEBIN THAT I WILL SEND>`.
- Run `npm install`.

### How to run the service
Run `npm start`.

### How to run the test suite
Run `npm test`.

### Notes
- The MarketStack API is limited to 100 requests per month. I've allocated a few accounts using various emails to test the functionality of this API. Let me know if you need another key to test.
- This application assumes low traffic. For higher traffic applications, it would be better to cache the responses from MarketStack or the Stock API provider to avoid making too many requests and for performance reasons.
- This application assumes that we have a hardcoded lookback date of a year. The endpoint could be extended to take in a number as a query parameter, n, where n is the number of days to look back.