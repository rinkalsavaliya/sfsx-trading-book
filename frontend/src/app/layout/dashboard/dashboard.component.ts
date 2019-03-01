import { Component, OnInit } from '@angular/core';
import { TradeSchema, GraphDataSchema, TradingLogSchema, Errors, ErrorRules, TradingBookSchama } from './dashboard.interface';
import { constants } from '../../shared';

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
  public allTickers = constants.allTickers;
  // declare and initiaze available sides
  public sides = constants.sides;
  public side = false;
  // declare and initiaze trade dtaa
  public trade: TradeSchema = {
    ticker: this.allTickers[0],
    trader: '',
    side: 'sell'
  } as TradeSchema;

  // declare and initiaze graph dtaa
  public graphData: Array<GraphDataSchema> = [
    { data: [], label: 'buy shares' },
    { data: [], label: 'sell shares' }
  ];
  public chartLabels: Array<string> = [];
  public chartOptions: object = {
    scales: {
      /**
      * make cumstom scales for y axes
      */
      yAxes: [{
        type: 'logarithmic',
        ticks: {
          callback: (tick: number) => {
            return Number(tick.toString());
          }
        },
        afterBuildTicks: (pckBarChart: object & { ticks: Array<number> }) => {
          pckBarChart.ticks = [];
          pckBarChart.ticks.push(0);
          pckBarChart.ticks.push(50);
          pckBarChart.ticks.push(100);
          pckBarChart.ticks.push(300);
          pckBarChart.ticks.push(500);
          pckBarChart.ticks.push(1000);
        }
      }]
    }
  };
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
  // object to handle all trade validation errors
  public tradeValidationErrors: Errors = {};
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
  * detect *enter* event on any input
  */
  onKeydown(event: KeyboardEvent = null) {
    this.tradeValidationErrors = {};
    if (event.key === 'Enter') {
      this.addTrade();
    }
  }


  /**
  * add a trade to the trade book, and process it
  * if it meets the eligibility criteria to get executed, execute it, be it partially or fully
  */
  addTrade() {
    this.trade.side = (this.side) ? 'sell' : 'buy';
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
      tradeBook.push(this.trade);
      this.reOrderTrades(tradeBook, oppReOrderType);
    } else {
      // else, the MUST be executed
      const trade: TradingLogSchema = {
        price: this.trade.price, shares: this.trade.shares,
        ticker: this.trade.ticker, timestamp: new Date().toLocaleString()
      };
      // consider the bigger price while executing trade
      if (oppTradeBook[0].price > this.trade.price) {
        trade.price = oppTradeBook[0].price;
      }
      // remainingShares - is ((rested order's shared) - (arrived order's trades))
      const remainingShares = oppTradeBook[0].shares - this.trade.shares;
      // is remainingShares is less than or equal to zero, that means the rested order will be removed from the book
      if (remainingShares <= 0) {
        trade.shares += remainingShares;
        this.trade.shares -= oppTradeBook[0].shares;

        oppTradeBook.shift();
        // is remainingShares is less than 0, then the extra shares will be added to the book
        // call processTrade recursively, to check if any trade is available after the execution
        if (remainingShares < 0) {
          if (
            oppTradeBook.length !== 0 &&
            (
              (tradeType === 'buy' && oppTradeBook[0].price <= this.trade.price) ||
              (tradeType === 'sell' && oppTradeBook[0].price >= this.trade.price)
            )
          ) {
            this.processTrade(tradeBook, oppTradeBook, oppReOrderType, tradeType);
          } else {
            tradeBook.push(this.trade);
            this.reOrderTrades(tradeBook, oppReOrderType);
          }
        }

        // remove rested order from the opposite side book
      } else {
        /*
        * if remainingShares is greater than 0, then the arrived order will get executed, for the requested number of shares
        * and we have to modify the order book, as the requested number of shares will be deducted from the top of the book's trade
        */
        oppTradeBook[0].shares -= trade.shares;
      }
      // push the trade to trading log, as the trade MUST be execute
      this.tradingLog.push(trade);
    }
    this.reOrderGraph();
  }


  /*
  * reorder graph data, after each trade is processed
  */
  reOrderGraph() {
    this.isGraphLoading = true;
    this.graphData = [
      { data: [], label: 'buy shares' },
      { data: [], label: 'sell shares' }
    ];
    this.chartLabels = [];

    this.allTickers.forEach((ticker) => {
      this.buyTradingBook[ticker].forEach((trade) => {
        this.initiazeChartLabel(trade);
        const index = this.chartLabels.indexOf(trade.price.toString());
        this.graphData[0].data[index] += trade.shares;
      });
      this.sellTradingBook[ticker].forEach((trade) => {
        this.initiazeChartLabel(trade);
        const index = this.chartLabels.indexOf(trade.price.toString());
        this.graphData[1].data[index] += trade.shares;
      });
    });

    setTimeout(() => {
      this.isGraphLoading = false;
    });
  }

  initiazeChartLabel(trade: TradeSchema) {
    if (!this.chartLabels.includes(trade.price.toString())) {
      this.chartLabels.push(trade.price.toString());
      this.graphData[0].data.push(0);
      this.graphData[1].data.push(0);
    }
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
    this.tradeValidationErrors = {};
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
          this.tradeValidationErrors[field] = `${field} must be a positive number`;
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
