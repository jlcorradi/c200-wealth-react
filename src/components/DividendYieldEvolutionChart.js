import React from 'react';
import ReactApexChart from 'react-apexcharts';
import {NumberHelper} from '../Helpers';

function DividendYieldEvolutionChart({monthArray, barSeries, onSelectMonth}) {
  return (
    <ReactApexChart
      options={{
        tooltip: {
          shared: true,
          intersect: false,
          y: {
            formatter: function (val) {
              return 'R$ ' + NumberHelper.formatBRL(val);
            },
          },
          x: {
            formatter: (val, opts) => {
              return (
                'Total: R$ ' +
                NumberHelper.formatBRL(opts.series.map((item) => item[opts.dataPointIndex]).reduce((n, n1) => n + n1))
              );
            },
          },
          followCursor: true,
        },
        zoom: {
          enabled: true,
        },
        dataLabels: {enabled: false},
        legend: {
          show: true,
        },
        title: {text: 'Dividends per month', align: 'left', margin: 20},
        chart: {
          type: 'bar',
          height: 300,
          stacked: true,
          events: {
            dataPointSelection: function (event, chartContext, config) {
              if (onSelectMonth) {
                onSelectMonth(monthArray[config.dataPointIndex]);
              }
            },
          },
        },
        plotOptions: {
          bar: {
            dataLabels: {
              orientation: 'horizontal',
              distributed: false,
            },
            horizontal: false,
          },
        },
        yaxis: {
          labels: {
            formatter: (val, opts) => {
              // return "yaxis.labels";
              return 'R$ ' + NumberHelper.formatBRL(val);
            },
          },
        },
        xaxis: {
          categories: monthArray,
          labels: {
            rotate: -60,
            rotateAlways: true,
            formatter: (val, opts) => {
              //return "xaxis.labels";
              return val;
            },
          },
        },
      }}
      width={600}
      height={400}
      series={barSeries}
      type="bar"
    />
  );
}

export default DividendYieldEvolutionChart;
