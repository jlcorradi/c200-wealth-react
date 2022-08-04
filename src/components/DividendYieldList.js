import React from 'react';
import { useDividendYieldStateContext } from '../store/DividendYieldStateContext';
import CrudTable from './CrudTable';
import { DividendYieldActions } from '../store/DividendYieldStateContext';
import QueryService from '../services/QueryService';
import BankAccountFilterEditor from './BankAccountFilterEditor';
import DividendYieldInstance from './DividendYieldInstance';
import DividendYieldService from '../services/DividendYieldService';
import { NumberHelper } from '../Helpers';

const config = {
  fields: [
    {
      field: 'id',
      label: '#',
    },
    {
      field: 'symbol',
      label: 'Ticker',
      functionalField: 'stock.symbol',
      allowSort: true,
      allowFilter: true,
    },
    {
      field: 'bankAccountDescription',
      label: 'Bank Account',
      functionalField: 'bankAccount.id',
      allowSort: true,
      allowFilter: true,
      renderFilterEditor: (fieldFilterValue, onChange) => (
        <BankAccountFilterEditor
          fieldFilterValue={fieldFilterValue}
          onChange={onChange}
        />
      ),
    },
    {
      field: 'quantity',
      allowSort: true,
    },
    {
      field: 'paymentDate',
      label: 'Payment Date',
      allowSort: true,
      allowFilter: true,
      filterType: 'DATE_RANGE',
    },
    {
      field: 'yieldType',
      label: 'Type',
      allowSort: true,
      allowFilter: true,
      renderFilterEditor: (fieldFilterValue, onChange) => {
        const [value] = fieldFilterValue ? fieldFilterValue : [''];
        return (
          <select value={value} onChange={(e) => onChange([e.target.value])}>
            <option>Select</option>
            <option value="DIVIDEND_YIELD">Dividend Yield</option>
            <option value="JCP">JCP</option>
            <option value="RENDIMENT">Rendiment</option>
          </select>
        );
      },
    },
    {
      field: 'amount',
      label: 'Amount',
      format: 'brl',
      className: 'text-right',
      allowSort: true,
      allowFilter: true,
      filterType: 'NUMBER_RANGE',
    },
  ],
};

function DividendYieldList() {
  const [
    { isLoading, hasMore, dividendYieldList, page, filter, order, totalAmount },
    dispatch,
  ] = useDividendYieldStateContext();
  const [instanceVisible, setInstanceVisible] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) {
      Promise.all([
        QueryService.query('DividendYieldEntity', filter, order, page),
        QueryService.sum('DividendYieldEntity', 'amount', filter),
      ]).then(([dataResponse, totalResponse]) => {
        dispatch(
          DividendYieldActions.loadData(dataResponse.data, totalResponse.data)
        );
      });
    }
  }, [isLoading]);

  return (
    <>
      <div className="titlebar">
        <h3>Dividend Yields</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setInstanceVisible(true);
            }}
          >
            <i className="bx bx-add-to-queue"></i>Register Yield
          </a>
        </div>
      </div>
      <CrudTable
        config={config}
        items={dividendYieldList}
        filter={filter}
        order={order}
        page={page}
        hasMore={hasMore}
        onPageChange={(page) => dispatch(DividendYieldActions.changePage(page))}
        onDeleteClick={async (item) => {
          if (!window.confirm('Are you sure you want to delete the record?')) {
            return;
          }
          await DividendYieldService.delete(item.id);
          dispatch(DividendYieldActions.setToLoad());
        }}
        onChangeFilter={(newFilter) => {
          dispatch(DividendYieldActions.changeFilter(newFilter));
        }}
        onChangeOrder={(order) =>
          dispatch(DividendYieldActions.changeOrder(order))
        }
        renderFooter={() => (
          <div className="padding flex flex-row justify-content-end">
            <strong>Total: </strong>
            <span className="margin-left">
              {NumberHelper.formatBRL(totalAmount)}
            </span>
          </div>
        )}
      />

      <DividendYieldInstance
        visible={instanceVisible}
        onDismiss={() => setInstanceVisible(false)}
      />
    </>
  );
}

export default DividendYieldList;
