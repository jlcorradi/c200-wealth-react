import React from 'react';
import DividendYieldService from '../services/DividendYieldService';
import SimpleTable from './SimpleTable';
import OffCanva from '../template/OffCanva';
import LoaderAndEmptyWrapper from './LoaderAndEmptyWrapper';

function DividendYieldOffCanva({monthToShow, visible, onDismiss}) {
  const [loading, setLoading] = React.useState(false);
  const [list, setList] = React.useState([]);
  const [total, setTotal] = React.useState(0);

  React.useEffect(() => {
    if (monthToShow) {
      setLoading(true);
      DividendYieldService.getMonthDys(monthToShow)
        .then(({data}) => {
          setList(data);
          setTotal(data.reduce((accumulator, next) => accumulator + next.amount, 0));
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
            labels={['Ticker', 'Date', 'Amount']}
            fields={['symbol', 'paymentDate', 'amount:toBRL']}
            total={total}
            groupingField="yieldType"
            groupingTotalField="amount"
            items={list.sort((i, j) => (i.yieldType > j.yieldType ? 1 : -1))}></SimpleTable>
        </div>
      </LoaderAndEmptyWrapper>
    </OffCanva>
  );
}

export default DividendYieldOffCanva;
