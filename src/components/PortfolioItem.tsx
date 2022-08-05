import React from "react";
import { ArrayHelper, DateHelper, NumberHelper } from "../Helpers";
import classNames from "classnames";
import DividendYieldService from "../services/DividendYieldService";
// @ts-ignore
import SimpleTable from "./SimpleTable";
import { Indicator } from "./Indicator";
import { IPortfolioEntity } from "../types/portfolio";

export const PortfolioItem: React.FC<{ item: IPortfolioEntity }> = ({
  item,
}) => {
  let outcome =
    ((item.lastPrice - item.adjustedAveragePrice) / item.adjustedAveragePrice) *
    100;

  const [dividends, setDividends] = React.useState([]);

  React.useEffect(() => {
    if (item.symbol) {
      DividendYieldService.getMonthlyDys(item.symbol).then(({ data }) => {
        setDividends(
          // @ts-ignore
          ArrayHelper.sortDescending(data, "month").map((dy) => ({
            month: DateHelper.getMonthYear(dy.month),
            amount: dy.amount,
            percentage: (dy.amount / item.currentAmount) * 100,
          }))
        );
      });
    }
  }, [item]);

  return (
    <>
      <div className="titlebar">
        <h3>General info - {item.symbol}</h3>
      </div>
      <div className="flex flex-row margin-bottom">
        <Indicator label="Last Price" value={item.lastPrice} />
        <Indicator label="A. Price" value={item.averagePrice} />
        <Indicator label="A.A. Price" value={item.adjustedAveragePrice} />
        <Indicator
          label="Outcome"
          value={NumberHelper.formatPercent(outcome)}
          color={outcome < 0 ? "danger" : "income"}
        />
      </div>
      <div className="flex flex-row padding align-items-center justify-content-center">
        {item.thumbImage ? (
          <img src={item.thumbImage} height="60" alt={item.description} />
        ) : null}
      </div>

      <div className="flex margin-h flex-column margin-bottom border-bottom">
        <div className="flex flex-row flex-1 align-items-space-between padding-bottom">
          <span className="flex-1">Description</span>
          <strong>{item.description}</strong>
        </div>
        <div className="flex flex-row flex-1 align-items-space-between padding-bottom">
          <span className="flex-1">Symbol</span>
          <strong>{item.symbol}</strong>
        </div>
        <div className="flex flex-row flex-1 align-items-space-between padding-bottom">
          <span className="flex-1">Last Price</span>
          <strong>{item.lastPrice}</strong>
        </div>
        <div
          className={classNames(
            "flex flex-row flex-1 align-items-space-between padding-bottom",
            {
              // @ts-ignore
              danger: item.lastPrice < item.averagePrice < 0,
            }
          )}
        >
          <span className="flex-1">A. Price</span>
          <strong>{item.averagePrice}</strong>
        </div>
        <div
          className={classNames(
            "flex flex-row flex-1 align-items-space-between padding-bottom",
            {
              danger: outcome < 0,
            }
          )}
        >
          <span className="flex-1">A. A. Price</span>
          <strong>{item.adjustedAveragePrice}</strong>
        </div>
        <div
          className={classNames(
            "flex flex-row flex-1 align-items-space-between padding-bottom",
            {
              danger: outcome < 0,
            }
          )}
        >
          <span className="flex-1">Outcome</span>
          <strong>{NumberHelper.formatPercent(outcome)}</strong>
        </div>
      </div>

      <div className="flex flex-column padding">
        <div className="flex flex-row flex-1 align-items-space-between padding-bottom">
          <span className="flex-1">Quantity</span>
          <strong>{item.quantity}</strong>
        </div>
        <div className="flex flex-row flex-1 align-items-space-between padding-bottom">
          <span className="flex-1">Total Invested</span>
          <strong>{NumberHelper.formatBRL(item.totalPrice)}</strong>
        </div>
        <div className="flex flex-row flex-1 align-items-space-between padding-bottom border-bottom">
          <span className="flex-1">Current Amount</span>
          <strong>{NumberHelper.formatBRL(item.currentAmount)}</strong>
        </div>
        <div className="flex flex-row flex-1 align-items-space-between padding-top padding-bottom">
          <span className="flex-1">Total</span>
          <strong
            className={classNames({
              danger: outcome < 0,
              income: outcome >= 0,
            })}
          >
            {NumberHelper.formatBRL(item.currentAmount - item.totalPrice)}
          </strong>
        </div>
        <div className="row margin-v">
          <div className="titlebar">
            <h3>Dividends - Last 12 months</h3>
          </div>

          <SimpleTable
            items={dividends}
            fields={["month", "amount:toBRL", "percentage:percent"]}
            labels={["Month", "Amount", "%"]}
            total={ArrayHelper.derivedSum(dividends, "amount")}
          />
          <div className="flex padding flex-row">
            <div className="flex-1">Total</div>
            <strong>
              {NumberHelper.formatPercent(
                ArrayHelper.derivedSum(dividends, "percentage")
              )}
            </strong>
          </div>
        </div>
      </div>
    </>
  );
};

export default PortfolioItem;
