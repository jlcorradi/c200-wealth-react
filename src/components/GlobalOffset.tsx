import React from "react";
import { useDashboardContext } from "../store/DashBoardStateContext";
//@ts-ignore
import { GlobalActions, useGlobalState } from "../store/GlobalStateContext";
//@ts-ignore
import OffCanva from "../template/OffCanva";
import { ExpenseIncomeInstance } from "./ExpenseIncomeInstance";

function GlobalOffCanva() {
  const {
    state: { activeExpenseIncomeId, globalOffcanvaVisible, globalOffsetTitle },
    actions: { dismissGlobalOffset },
  } = useGlobalState();
  const { state, actions } = useDashboardContext();

  return (
    <OffCanva
      tittle={globalOffsetTitle}
      visible={globalOffcanvaVisible}
      onDismiss={() => dismissGlobalOffset()}
    >
      {activeExpenseIncomeId > 0 && (
        <ExpenseIncomeInstance
          showVertically={true}
          id={activeExpenseIncomeId}
          onDismiss={() => {
            actions.markToReload();
            dismissGlobalOffset();
          }}
        ></ExpenseIncomeInstance>
      )}
    </OffCanva>
  );
}

export default GlobalOffCanva;
