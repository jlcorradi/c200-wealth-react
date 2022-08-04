import React from 'react';
import {
  DashboardActions,
  useDashboardContext,
} from '../store/DashBoardStateContext';
import { GlobalActions, useGlobalState } from '../store/GlobalStateContext';
import OffCanva from '../template/OffCanva';
import ExpenseIncomeInstance from './ExpenseIncomeInstance';

function GlobalOffCanva() {
  const [{ activeExpenseIncomeId, globalOffcanvaVisible, globalOffsetTitle }, globalDispatch] =
    useGlobalState();
  const [, dashboardDispatch] = useDashboardContext();

  return (
    <OffCanva
      tittle={globalOffsetTitle}
      visible={globalOffcanvaVisible}
      onDismiss={() => globalDispatch(GlobalActions.dismissGlobalOffset())}
    >
      {activeExpenseIncomeId > 0 && (
        <ExpenseIncomeInstance
          showVertically="true"
          id={activeExpenseIncomeId}
          onDismiss={() => {
            dashboardDispatch(DashboardActions.loadExpenseIncomeSum());
            dashboardDispatch(
              DashboardActions.loadMonthlyExpenseIncomeSummary()
            );
            globalDispatch(GlobalActions.showExpenseIncomeOffset(0));
          }}
        ></ExpenseIncomeInstance>
      )}
    </OffCanva>
  );
}

export default GlobalOffCanva;
