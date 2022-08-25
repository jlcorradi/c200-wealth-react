import React, { FC, PropsWithChildren } from "react";
import DividendYieldService from "../services/DividendYieldService";
//@ts-ignore
import SimpleTable from "./SimpleTable";
import OffCanva from "../template/OffCanva";
import { LoaderAndEmptyWrapper } from "./LoaderAndEmptyWrapper";
import { DividendYieldEntity } from "../types/dividend-yield";

export const DividendYieldOffCanva: FC<
  PropsWithChildren<{
    monthToShow: string;
    visible: boolean;
    onDismiss: () => void;
  }>
> = ({ monthToShow, visible, onDismiss }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [list, setList] = React.useState<DividendYieldEntity[]>([]);
  const [total, setTotal] = React.useState<number>(0);

  React.useEffect(() => {
    if (monthToShow) {
      setLoading(true);
      DividendYieldService.getMonthDys(monthToShow)
        .then(({ data }) => {
          setList(data);
          setTotal(
            data.reduce(
              (accumulator: number, next: DividendYieldEntity) =>
                accumulator + next.amount,
              0
            )
          );
        })
        .finally(() => setLoading(false));
    }
  }, [monthToShow]);

  return (
    <OffCanva visible={visible} onDismiss={onDismiss}>
      <LoaderAndEmptyWrapper isEmpty={list.length === 0} isLoading={loading}>
        <div className="titlebar">
          <h3>Dividends paid in {monthToShow}</h3>
        </div>
        <div className="padding">
          <SimpleTable
            labels={["Ticker", "Date", "Amount"]}
            fields={["symbol", "paymentDate", "amount:toBRL"]}
            total={total}
            groupingField="yieldType"
            groupingTotalField="amount"
            items={list.sort((i, j) => (i.yieldType > j.yieldType ? 1 : -1))}
          ></SimpleTable>
        </div>
      </LoaderAndEmptyWrapper>
    </OffCanva>
  );
};

export default DividendYieldOffCanva;
