import React from "react";
import { Indicator, IndicatorIcon } from "./Indicator";
import { NumberHelper } from "../Helpers";
import { usePortfolioStateContext } from "../store/PortfolioStateContext";

export const PortfolioSummaryIndicators: React.FC<{
  avgMonthlyDividend: number;
}> = ({ avgMonthlyDividend }) => {
  const ctx = usePortfolioStateContext();
  const summary = ctx?.state?.summary;

  React.useEffect(() => {}, []);

  const outcome =
    (summary?.totalCurrent ?? 0 - (summary?.totalInvested ?? 0)) /
    (summary?.totalInvested ?? 0);

  return (
    <>
      <Indicator
        label="Total In Stocks"
        color="default"
        value={NumberHelper.formatBRL(summary?.totalCurrentStocks ?? 0)}
        icon={IndicatorIcon.Label}
      />
      <Indicator
        label="Total In FIIs"
        color="default"
        value={NumberHelper.formatBRL(summary?.totalCurrentFII ?? 0)}
        icon={IndicatorIcon.BuildingHouse}
      />
      <Indicator
        label="Total Current"
        color="default"
        value={NumberHelper.formatBRL(summary?.totalCurrent ?? 0)}
        icon={IndicatorIcon.Detail}
      />
      <Indicator
        label="Outcome"
        color={outcome > 0 ? "default" : "danger"}
        value={NumberHelper.formatPercent(outcome)}
        icon={IndicatorIcon.Detail}
      />
      <Indicator
        label="DY Month TD"
        value={NumberHelper.formatBRL(ctx.state.dyMonthTD)}
        icon={IndicatorIcon.ArchiveIn}
      />
      <Indicator
        label="DY Year TD"
        value={NumberHelper.formatBRL(ctx.state.dyYearTD)}
        icon={IndicatorIcon.CalendarSCheck}
      />
      <Indicator
        label="DY Monthly AVG"
        value={NumberHelper.formatBRL(avgMonthlyDividend)}
        icon={IndicatorIcon.CalendarCheck}
      />
    </>
  );
};

export default PortfolioSummaryIndicators;
