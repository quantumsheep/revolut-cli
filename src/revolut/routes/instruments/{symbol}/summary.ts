import * as api from '../../../api';

export interface InstrumentsSymbolSummaryVolume {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryDayRangeLow {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryDayRangeHigh {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryDayRange {
  low: InstrumentsSymbolSummaryDayRangeLow;
  high: InstrumentsSymbolSummaryDayRangeHigh;
}

export interface InstrumentsSymbolSummaryFiftyTwoWeekRangeLow {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryFiftyTwoWeekRangeHigh {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryFiftyTwoWeekRange {
  low: InstrumentsSymbolSummaryFiftyTwoWeekRangeLow;
  high: InstrumentsSymbolSummaryFiftyTwoWeekRangeHigh;
}

export interface InstrumentsSymbolSummaryFiveYearRangeLow {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryFiveYearRangeHigh {
  amount: number;
  currency: string;
}

export interface InstrumentsSymbolSummaryFiveYearRange {
  low: InstrumentsSymbolSummaryFiveYearRangeLow;
  high: InstrumentsSymbolSummaryFiveYearRangeHigh;
}

export interface InstrumentsSymbolSummaryTicker {
  instrument: string;
  last: number;
  previous: number;
  previousClose: number;
  lastClose: number;
  currency: string;
  status: string;
  tradingSession: string;
  nextOpenUtcTimestamp: number;
  updatedAt: number;
}

export interface InstrumentsSymbolSummary {
  volume: InstrumentsSymbolSummaryVolume;
  unitVolume: number;
  dayRange: InstrumentsSymbolSummaryDayRange;
  '52weekRange': InstrumentsSymbolSummaryFiftyTwoWeekRange;
  '5YearRange': InstrumentsSymbolSummaryFiveYearRange;
  updatedAt: number;
  ticker: InstrumentsSymbolSummaryTicker;
}

export async function summary(symbol: string) {
  return await api.request<InstrumentsSymbolSummary>('GET', `/instruments/${symbol}/summary`);
}
