import * as api from '../../../api';

export interface PortfolioKycDisclosuresProvided {
  usTaxPayer: boolean;
  brexitOptIn: boolean;
}

export interface PortfolioKycDisclosuresRequired {
  brexitOptIn: boolean;
}

export interface PortfolioKycDisclosures {
  provided: PortfolioKycDisclosuresProvided;
  required: PortfolioKycDisclosuresRequired;
  usTaxPayer: boolean;
  rtlBrexitOptIn: boolean;
}

export interface PortfolioKycDocument {
  documentCode: string;
  value: string;
  country: string;
  documentKey: string;
  countryCode: string;
  documentName: string;
}

export interface PortfolioKyc {
  disclosures: PortfolioKycDisclosures;
  documents: PortfolioKycDocument[];
  address: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  countryOfBirth: string;
  countryOfResidence: string;
  firstNationality: string;
  usTaxPayer: boolean;
  rtlBrexitOptIn: boolean;
}

export interface PortfolioInfoStock {
  countryCode: string;
  onboardingStatus: string;
}

export interface PortfolioInfo {
  STOCK: PortfolioInfoStock;
}

export interface PortfolioDisclosures {
  rtlBrexitOptInRequired: boolean;
  rtlBrexitOptInSkippable: boolean;
}

export interface PortfolioHoldingUnsettled {
  amount: number;
  currency: string;
}

export interface PortfolioHoldingCommitted {
  amount: number;
  currency: string;
}

export interface PortfolioHoldingAvailableToInvest {
  amount: number;
  currency: string;
}

export interface PortfolioHoldingTotal {
  amount: number;
  currency: string;
  quantity: string;
  type: string;
}

export interface PortfolioHoldingAvailableToWithdraw {
  amount: number;
  currency: string;
}

export interface PortfolioHoldingBalance {
  amount: number;
  currency: string;
  type: string;
  quantity: string;
}

export interface PortfolioHoldingPending {
  amount: number;
  currency: string;
  type: string;
  quantity: string;
}

export interface PortfolioHoldingDetails {
  pocketId: string;
  ticker: string;
}

export interface PortfolioHoldingAvailable {
  quantity: string;
  type: string;
}

export interface PortfolioHoldingAveragePrice {
  amount: number;
  currency: string;
}

export interface PortfolioHoldingAssetInfo {
  ticker: string;
  gap: number;
  stampDutyRate: number;
}

export interface PortfolioHolding {
  id: string;
  currency: string;
  assetType: string;
  unsettled: PortfolioHoldingUnsettled;
  committed: PortfolioHoldingCommitted;
  availableToInvest: PortfolioHoldingAvailableToInvest;
  total: PortfolioHoldingTotal;
  availableToWithdraw: PortfolioHoldingAvailableToWithdraw;
  balance: PortfolioHoldingBalance;
  pending: PortfolioHoldingPending;
  assetSource: string;
  state: string;
  name: string;
  details: PortfolioHoldingDetails;
  createdDate: number;
  performance: any[];
  symbol: string;
  available: PortfolioHoldingAvailable;
  averagePrice: PortfolioHoldingAveragePrice;
  assetInfo: PortfolioHoldingAssetInfo;
}

export interface PortfolioDayTrades {
  current: number;
  limit: number;
}

export interface PortfolioBalance {
  amount: number;
  currency: string;
}

export interface Portfolio {
  id: string;
  state: string;
  kyc: PortfolioKyc;
  info: PortfolioInfo;
  assetTypes: string[];
  disclosures: PortfolioDisclosures;
  holdings: PortfolioHolding[];
  dayTrades: PortfolioDayTrades;
  performance: any[];
  balance: PortfolioBalance;
  reports: any[];
}

export async function portfolio() {
  return await api.request<Portfolio>('GET', '/user/current/portfolio');
}
