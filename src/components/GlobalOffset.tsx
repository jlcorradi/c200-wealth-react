import React from "react";
import { useDashboardContext } from "../store/DashBoardStateContext";
//@ts-ignore
import { GlobalActions, useGlobalState } from "../store/GlobalStateContext";
//@ts-ignore
import OffCanva from "../template/OffCanva";
//@ts-ignore
import ExpenseIncomeInstance from "./ExpenseIncomeInstance";

function GlobalOffCanva() {
  const [
    { activeExpenseIncomeId, globalOffcanvaVisible, globalOffsetTitle },
    globalDispatch,
  ] = useGlobalState();
  const { state, actions } = useDashboardContext();

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
            actions.markToReload();
            globalDispatch(GlobalActions.showExpenseIncomeOffset(0));
          }}
        ></ExpenseIncomeInstance>
      )}
    </OffCanva>
  );
}

export default GlobalOffCanva;
