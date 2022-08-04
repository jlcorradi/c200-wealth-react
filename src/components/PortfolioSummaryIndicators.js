import React from 'react';
import Indicator from './Indicator';
import { NumberHelper } from '../Helpers';
import { usePortfolioStateContext } from '../store/PortfolioStateContext';

function PortfolioSummaryIndicators({ avgMonthlyDividend }) {
  const [{ summary }] = usePortfolioStateContext();

  return (
    <>
      <Indicator
        label="Total In Stocks"
        color="default"
        value={NumberHelper.formatBRL(summary.totalCurrentStocks)}
        icon="bx-label"
      />
      <Indicator
        label="Total In FIIs"
        color="default"
        value={NumberHelper.formatBRL(summary.totalCurrentFII)}
        icon="bx-building-house"
      />
      {/* <Indicator
        label="Total invested"
        color="default"
        value={NumberHelper.formatBRL(summary.totalInvested)}
        icon="bx-detail"
      /> */}
      <Indicator
        label="Total Current"
        color="default"
        value={NumberHelper.formatBRL(summary.totalCurrent)}
        icon="bx-detail"
      />
      <Indicator
        label="Outcome"
        color={
          summary.totalCurrent - summary.totalInvested > 0
            ? 'default'
            : 'danger'
        }
        value={NumberHelper.formatPercent(
          ((summary.totalCurrent - summary.totalInvested) /
            summary.totalInvested) *
            100
        )}
        icon="bx-detail"
      />
      <Indicator
        label="AVG monthly dividends"
        value={NumberHelper.formatBRL(avgMonthlyDividend)}
        icon="bxs-archive-in"
      />
    </>
  );
}

export default PortfolioSummaryIndicators;
