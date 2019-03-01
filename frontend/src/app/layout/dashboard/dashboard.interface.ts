export interface TradeSchema {
  ticker: string;
  trader: string;
  price: number;
  shares: number;
  side: string;
}

export interface TradingBookSchama {
  [key: string]: Array<TradeSchema>;
}

export interface GraphDataSchema {
  data: Array<number>;
  label: string;
}

export interface TradingLogSchema {
  timestamp: string;
  ticker: string;
  price: number;
  shares: number;
}

export interface Errors {
  [key: string]: string;
}

export const ErrorRules = {
  ticker: { required: true, allowedValues: ['ZGRO', 'FB', 'ORCL', 'GOOG'] },
  trader: { required: true },
  price: { required: true, number: true },
  shares: { required: true, number: true },
  side: { required: true, allowedValues: ['buy', 'sell'] }
};
