import { Component, OnInit } from '@angular/core';
import { TradeSchema, GraphDataSchema, TradingLogSchema, Errors, ErrorRules, TradingBookSchama } from './dashboard.interface';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})


/**
* @class DashboardComponent - to render dashboard
* and handle submit event of *ADD NEW TRADE*
* and if the trade execution criteria match, execute the trade
*/
export class DashboardComponent implements OnInit {
  public allTickers: Array<string> = ['ZGRO', 'FB', 'ORCL', 'GOOG'];
  // declare and initiaze available sides
  public sides: Array<string> = ['buy', 'sell'];
  // declare and initiaze trade dtaa
  public trade: TradeSchema = {
    ticker: this.allTickers[0],
    trader: '',
    side: 'buy'
  } as TradeSchema;

  // declare and initiaze graph dtaa
  public graphData: Array<GraphDataSchema> = [
    { data: [], label: 'shares' }
  ];
  public chartLabels: Array<string> = [];
  // a log of the executed orders
  public tradingLog: Array<TradingLogSchema> = [];

  /*
  * buy and sell trading books will have a structure like this
  * {
  *  'ZGRO': Array of trades rested in the book for ZGRO ticker
  *  'FB': Array of trades rested in the book for FB ticker
  *  and so on...
  * }
  * here, array of trades will be in sorted order of the *price*
  * for buy trading book, array of trades will be in descending order of their price
  * for sell trading book, array of trades will be in ascending order of their price
  */
  public buyTradingBook: TradingBookSchama = {};
  public sellTradingBook: TradingBookSchama = {};
  // object to handle all trade tradeValidationErrors
  public tradeValidationErrors: Errors = {};

  /*
  * maintain an object to hold all unique prices, with number of shares for that price
  * totalPrices = {
  *  '101.43': 300 // there are 300 total shares in trade book for price = 101.43, and so on
  * }
  *
  */
  public totalPrices: { [key: string]: number } = {};
  public isGraphLoading = false;
  constructor() {
    // for all tickers, initiaze the buy and sell trading book values for given ticker
    this.allTickers.forEach((ticker) => {
      this.buyTradingBook[ticker] = [];
      this.sellTradingBook[ticker] = [];
    });
  }

  ngOnInit() {}

  /**
  * add a trade to the trade book, and process it
  * if it meets the eligibility criteria to get executed, execute it, be it partially or fully
  */
  addTrade() {
    if (this.validateTrade()) {
      if (this.trade.side === 'buy') {
        this.processTrade(this.buyTradingBook[this.trade.ticker], this.sellTradingBook[this.trade.ticker], 'max', 'buy');
      } else {
        this.processTrade(this.sellTradingBook[this.trade.ticker], this.buyTradingBook[this.trade.ticker], 'min', 'sell');
      }
      this.resetTrade();
    }
  }

  /**
  * this function processes the trade
  */
  processTrade(tradeBook: Array<TradeSchema>, oppTradeBook: Array<TradeSchema>, oppReOrderType: string, tradeType: string) {
    /*
    * is oppsite side trade book is blank, or
    * for buy trade, latest opp side trade's price is greater than newly arrived trade's price, then add the trade to the trade book
    * and reorder the trade according to the prices
    */
    if (
      oppTradeBook.length === 0 ||
      (tradeType === 'buy' && oppTradeBook[0].price > this.trade.price) ||
      (tradeType === 'sell' && oppTradeBook[0].price < this.trade.price)
    ) {
      this.addRestedTrade(tradeBook, this.trade);
      this.reOrderTrades(tradeBook, oppReOrderType);
    } else {
      // else, the MUST be executed
      const trade: TradingLogSchema = {
        price: this.trade.price, shares: this.trade.shares,
        ticker: this.trade.ticker, timestamp: new Date().toLocaleString()
      };
      // remainingShares - is rested order's shared - arrived order's trades
      const remainingShares = oppTradeBook[0].shares - this.trade.shares;
      // is remainingShares is less than or equal to zero, that means the rested order will be removed from the book
      if (remainingShares <= 0) {
        trade.shares += remainingShares;
        this.trade.shares -= oppTradeBook[0].shares;
        // is remainingShares is less than 0, then the extra shares will be added to the book
        if (remainingShares < 0) {
          this.addRestedTrade(tradeBook, this.trade);
          this.reOrderTrades(tradeBook, oppReOrderType);
        }
        // remove rested order from the opposite side book
        this.removeRestedTrade(oppTradeBook);
      } else {
        /*
        * if remainingShares is greater than 0, then the arrived order will get executed, for the requested number of shares
        * and we have to modify the order book, as the requested number of shares will be deducted from the top of the book's trade
        */
        this.modifyChartAndTradingBook(oppTradeBook, this.trade);
      }
      // push the trade to trading log, as the trade MUST be execute
      this.tradingLog.push(trade);
    }
  }


  /*
  * this function adds one trade to the trade book (be it buy side book or sell side book)
  * it modifies the graph data accordingly
  */
  addRestedTrade(tradeBook: Array<TradeSchema>, trade: TradeSchema) {
    this.isGraphLoading = true;
    tradeBook.push(trade);
    // if given price is not available in totalPrices, then add price to it, and add one element in graphData
    if (!this.totalPrices[trade.price]) {
      this.totalPrices[trade.price] = trade.shares;
      this.chartLabels.push(trade.price.toString());
      this.graphData[0].data.push(trade.shares);
    } else {
      // else, just modify graphData
      const index = this.chartLabels.indexOf(trade.price.toString());
      this.totalPrices[trade.price] += trade.shares;
      this.graphData[0].data[index] += trade.shares;
    }
    setTimeout(() => {
      this.isGraphLoading = false;
    });
  }

  /*
  * this function removes the rested trade from the trade book, and it modifies the graph data accordingly
  */
  removeRestedTrade(tradeBook: Array<TradeSchema>) {
    this.isGraphLoading = true;
    // modify totalPrices
    this.totalPrices[tradeBook[0].price.toString()] -= tradeBook[0].shares;
    // if totalPrices[trade_price] = 0, remove given graph data for given price
    if (this.totalPrices[tradeBook[0].price.toString()] === 0) {
      const index = this.chartLabels.indexOf(tradeBook[0].price.toString());
      this.graphData[0].data.splice(index, 1);
      this.chartLabels.splice(index, 1);
      delete this.totalPrices[tradeBook[0].price.toString()];
    }
    tradeBook.shift();
    setTimeout(() => {
      this.isGraphLoading = false;
    });
  }


  /*
  * function which modifies the trading book, and the chart, in case of partial execution of the trade
  */
  modifyChartAndTradingBook(tradeBook: Array<TradeSchema>, trade: TradeSchema) {
    this.isGraphLoading = true;
    // partial execution is done, so the top of the book's trades are modified
    tradeBook[0].shares -= trade.shares;

    // modify the graph data
    this.totalPrices[tradeBook[0].price.toString()] -= trade.shares;
    const index = this.chartLabels.indexOf(tradeBook[0].price.toString());
    this.graphData[0].data[index] = tradeBook[0].shares;

    setTimeout(() => {
      this.isGraphLoading = false;
    });
  }


  /*
  * function which sorts the trades, based on the price value
  * as, the top of the book will always contain the
  *  - trade with the heighest price in case of buy side, and
  *  - trade with the lowest price in case of sell side
  */
  reOrderTrades(tradeBook: Array<TradeSchema>, type: string) {
    if (tradeBook.length > 1) {
      if (type === 'max') {
        tradeBook = tradeBook.sort((obj1, obj2) => obj1.price <= obj2.price ? 1 : -1);
      } else {
        tradeBook = tradeBook.sort((obj1, obj2) => obj1.price >= obj2.price ? 1 : -1);
      }
    }
  }


  /*
  * function to reset the trade after trade is executed, or if user clicks on reste button
  */
  resetTrade() {
    this.trade = {
      ticker: this.trade.ticker,
      trader: '',
      side: this.trade.side
    } as TradeSchema;
  }


  /*
  * this function validates the input values for given trade
  * this validator constant is used to validate the trade values
  * ErrorRules = {
  *   ticker: { required: true, allowedValues: ['ZGRO', 'FB', 'ORCL', 'GOOG'] },
  *   trader: { required: true },
  *   price: { required: true, number: true },
  *   shares: { required: true, number: true },
  *   side: { required: true, allowedValues: ['buy', 'sell'] }
  * };
  * for each field, whether the field is required, if it must be a number
  * and if it should be one form given values is provided, and based on that
  * validation is done
  */
  validateTrade() {
    this.tradeValidationErrors = {};
    if (
      this.allTickers.includes(this.trade.ticker) && this.trade.price && !isNaN(this.trade.price)
      && this.trade.shares && !isNaN(this.trade.shares) && this.sides.includes(this.trade.side) && this.trade.trader
    ) {
      return true;
    }
    for (const field in ErrorRules) {
      if (this.trade[field]) {
        if (ErrorRules[field].number && (!this.trade[field] || isNaN(this.trade[field]))) {
          this.tradeValidationErrors[field] = `${field} must be a number`;
          return false;
        }
        if (ErrorRules[field].allowedValues && !ErrorRules[field].allowedValues.includes(this.trade[field])) {
          this.tradeValidationErrors[field] = `selected ${field} is not valid`;
          return false;
        }
      } else {
        this.tradeValidationErrors[field] = `${field} is required`;
        return false;
      }
    }
  }
}
