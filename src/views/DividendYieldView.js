import React, { useEffect, useState } from 'react';
import DividendYieldInstance from '../components/DividendYieldInstance';
import DividendYieldTable from '../components/DividendYieldTable';
import GlobalFilter from '../components/GlobalFilter';
import LoadMoreButton from '../components/LoadMoreButton';
import DividendYieldService from '../services/DividendYieldService';
import {
  DividendYieldActions,
  useDividendYieldStateContext,
} from '../store/DividendYieldStateContext';

function DividendYieldView() {
  const [{ hasMore, loadingPending, filter, order, page }, dispatch] =
    useDividendYieldStateContext();
  const [filterVisible, setFilterVisible] = useState(false);
  const [instanceVisible, setInstanceVisible] = useState(false);

  useEffect(loadData, [loadingPending]);

  function loadData() {
    if (loadingPending) {
      DividendYieldService.query({ ...filter, page, order, pageSize: 20 }).then(
        (response) =>
          dispatch(
            DividendYieldActions.loadData(
              response.data,
              Number.parseFloat(response.headers['x-total-amount'])
            )
          )
      );
    }
  }

  return (
    <>
      <div className="titlebar">
        <h3>Dividend Yield</h3>
        <div className="buttons">
          <a
            href="#new"
            onClick={(e) => {
              e.preventDefault();
              setInstanceVisible(true);
            }}
          >
            <i className="bx bx-add-to-queue"></i>New
          </a>
          <a
            href="#Filter"
            onClick={(e) => {
              e.preventDefault();
              setFilterVisible(true);
            }}
          >
            <i className="bx bx-filter-alt"></i>Filter
          </a>
        </div>
      </div>

      <GlobalFilter
        supportedFields="bankAccountId,dateInterval,symbol"
        visible={filterVisible}
        onDismiss={() => setFilterVisible(false)}
        onChange={(newFilter) => {
          dispatch(DividendYieldActions.changeFilter(newFilter));
          setFilterVisible(false);
        }}
        filter={filter}
      />

      <div className="box padding align-items-center justify-content-center shadow">
        <DividendYieldTable />
        <LoadMoreButton
          enabled={hasMore}
          onClick={() => dispatch(DividendYieldActions.changePage(page + 1))}
        />
      </div>

      <DividendYieldInstance
        visible={instanceVisible}
        onDismiss={() => setInstanceVisible(false)}
      />
    </>
  );
}

export default DividendYieldView;
