import React from 'react';
import Chart from 'react-apexcharts';
import ChartOptions from '../ChartOptions';
import { NumberHelper } from '../Helpers';

function StockDonutChart({ width, stocks, onItemClick }) {
  return (
    <Chart
      options={{
        ...ChartOptions.donuts,
        tooltip: {
          ...ChartOptions.donuts.tooltip,
          custom: function ({ series, seriesIndex, w }) {
            let total = 0;
            for (let x of series) {
              total += x;
            }
            let selected = series[seriesIndex];
            let thumb = stocks.find(
              (i) => i.symbol === w.config.labels[seriesIndex]
            ).thumbImage;
            return `<div style="color: #898788" 
                         class="padding align-items-center justify-contents-center box box-shadow flex flex-column">
                          ${
                            thumb
                              ? `<div class="w200 flex align-items-center justify-content-center padding margin border-bottom"><img src="${thumb}" height="36" /></div>`
                              : ''
                          }
                          <span>${w.config.labels[seriesIndex]}</span>
                          <strong>R$${NumberHelper.formatBRL(selected)} <br> ${
              ((selected / total) * 100).toFixed(2) + '%'
            }</strong></div>`;
          },
        },
        labels: stocks.map((s) => s.symbol),
        chart: {
          events: {
            dataPointSelection: function (event, chartContext, config) {
              if (onItemClick) {
                onItemClick(
                  stocks.find(
                    (i) =>
                      i.symbol === config.w.config.labels[config.dataPointIndex]
                  )
                );
              }
            },
          },
        },
      }}
      series={stocks.map((s) => s.currentAmount)}
      type="donut"
      width={width}
    />
  );
}

export default StockDonutChart;
