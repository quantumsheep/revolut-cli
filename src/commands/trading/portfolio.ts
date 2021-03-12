import { Command } from 'commander';
import { loginIfDisconnected } from '../login';
import * as revolut from '../../revolut';
import Table from 'cli-table';
import chalk from 'chalk';

export const command = new Command('portfolio');

function toCurrency(value: number, currency: string, withPrefix: boolean = false) {
  let prefix = '';

  if (withPrefix) {
    prefix = (value < 0) ? '-' : '+';
    value = Math.abs(value);
  }


  switch (currency) {
    case 'USD': return `${prefix}$${value.toFixed(2)}`;
    case 'EUR': return `${prefix}${value.toFixed(2)}€`;
    default: return `${currency} ${prefix}${value.toFixed(2)}`;
  }
}

async function displayPortfolio() {
  const portfolio = await revolut.portfolio();
  const stocks = portfolio.holdings.filter(holding => holding.assetType === 'STOCK');

  const table = new Table({
    head: ['Symbol', 'Name', 'Today Change', '52 Weeks Change', '5 Years Change', 'Shares', 'Average Price', 'Current Price', 'PNL'],
  });

  const data = await Promise.all(stocks.map(async (stock) => {
    const summary = await revolut.summary(stock.symbol);

    const averagePrice = (stock.averagePrice.amount / 100);
    const lastPrice = (summary.ticker.last / 100);
    const pnl = lastPrice / averagePrice * 100 - 100;

    return {
      symbol: stock.symbol,
      name: stock.name,
      todayLow: summary.dayRange.low.amount / 100,
      todayHigh: summary.dayRange.high.amount / 100,
      fiftyWeeksLow: summary['52weekRange'].low.amount / 100,
      fiftyWeeksHigh: summary['52weekRange'].high.amount / 100,
      fiveYearsLow: summary['5YearRange'].low.amount / 100,
      fiveYearsHigh: summary['5YearRange'].high.amount / 100,
      currency: stock.currency,
      available: +stock.available.quantity,
      averagePrice,
      lastPrice,
      pnl,
    }
  }));

  const lastPriceDiff = (row: typeof data[0]) => {
    return (row.lastPrice * row.available) - (row.averagePrice * row.available);
  }

  const rows = data
    .sort((a, b) => lastPriceDiff(b) - lastPriceDiff(a))
    .map(row => {
      const prefix = (row.pnl >= 0) ? '+' : '';
      const diff = lastPriceDiff(row);

      const color = (row.pnl === 0) ? chalk.reset : ((row.pnl >= 0) ? chalk.greenBright : chalk.redBright);

      return [
        row.symbol,
        row.name,
        `${toCurrency(row.todayLow, row.currency)} - ${toCurrency(row.todayHigh, row.currency)}`,
        `${toCurrency(row.fiftyWeeksLow, row.currency)} - ${toCurrency(row.fiftyWeeksHigh, row.currency)}`,
        `${toCurrency(row.fiveYearsLow, row.currency)} - ${toCurrency(row.fiveYearsHigh, row.currency)}`,
        row.available,
        toCurrency(row.averagePrice, row.currency),
        toCurrency(row.lastPrice, row.currency),
        color(`${prefix}${row.pnl.toFixed(2)}% (${toCurrency(diff, row.currency, true)})`),
      ];
    });

  table.push(...rows);

  console.log(table.toString());
}

command.action(async () => {
  await loginIfDisconnected();
  await displayPortfolio();
});
