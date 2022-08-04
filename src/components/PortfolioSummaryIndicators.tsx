import React from "react";
import { Indicator } from "./Indicator";
import { NumberHelper } from "../Helpers";
import { usePortfolioStateContext } from "../store/PortfolioStateContext";
import QueryService from "../services/QueryService";
import moment from "moment";

export const PortfolioSummaryIndicators: React.FC<{
  avgMonthlyDividend: number;
}> = ({ avgMonthlyDividend }) => {
  const [{ summary }] = usePortfolioStateContext();
  const [dyMonthTd, setDyMonthTD] = React.useState<number>(0);

  React.useEffect(() => {
    QueryService.sum("DividendYieldEntity", "amount", {
      paymentDate: [
        moment().startOf("month").format("DD/MM/YYYY"),
        moment().endOf("month").format("DD/MM/YYYY"),
      ],
    }).then(({ data }) => setDyMonthTD(data));
  }, []);

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
            ? "default"
            : "danger"
        }
        value={NumberHelper.formatPercent(
          ((summary.totalCurrent - summary.totalInvested) /
            summary.totalInvested) *
            100
        )}
        icon="bx-detail"
      />
      <Indicator
        label="DY Month TD"
        value={NumberHelper.formatBRL(dyMonthTd)}
        icon="bxs-archive-in"
      />
      <Indicator
        label="AVG monthly dividends"
        value={NumberHelper.formatBRL(avgMonthlyDividend)}
        icon="bxs-archive-in"
      />
    </>
  );
};

export default PortfolioSummaryIndicators;
