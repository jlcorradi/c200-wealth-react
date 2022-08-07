import React, { useEffect, useState } from "react";
import moment from "moment";
import { ExpenseIncomeService } from "../services/ExpenseIncomeService";
import ChartOptions from "../ChartOptions";
import Chart from "react-apexcharts";
import LoaderAndEmptyWrapper from "./LoaderAndEmptyWrapper";

function ExpensesPerCategory() {
  useEffect(loadData, []);
  const [isLoading, setLoading] = useState(false);
  const [list, setList] = useState([]);

  function loadData() {
    setLoading(true);
    let filter = {
      dateIni: moment().startOf("month").format("DD/MM/YYYY"),
      dateEnd: moment().endOf("month").format("DD/MM/YYYY"),
      paymentType: "EXPENSE",
      pageSize: 20000,
    };

    ExpenseIncomeService.query(0, filter, "category.description(ASC)")
      .then((response) => {
        var result = [];
        response.data.content.reduce(function (res, value) {
          if (!res[value.categoryDescription]) {
            res[value.categoryDescription] = {
              categoryDescription: value.categoryDescription,
              amount: 0,
            };
            result.push(res[value.categoryDescription]);
          }
          res[value.categoryDescription].amount += value.amount;
          return res;
        }, {});
        setList(result);
      })
      .finally(() => setLoading(false));
  }

  return (
    <LoaderAndEmptyWrapper
      isLoading={isLoading}
      isEmpty={list.length === 0}
      loadingMessage="Loading Expense/Income per category chart"
    >
      <Chart
        options={{
          ...ChartOptions.donuts,
          labels: list.map((s) => s.categoryDescription),
        }}
        series={list.map((s) => s.amount)}
        type="donut"
        width="360"
      />
    </LoaderAndEmptyWrapper>
  );
}

export default ExpensesPerCategory;
