interface IW {
  config: { labels: string[] };
}

const ChartOptions = {
  donuts: {
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
          labels: {
            show: true,
            position: "top",
            value: {
              formatter: (val: string) =>
                Number.parseFloat(val).toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                }),
            },
            total: {
              show: true,
              formatter: (val: { globals: { total: number } }) =>
                val.globals.total.toLocaleString("pt-br", {
                  minimumFractionDigits: 2,
                }),
            },
          },
        },
      },
    },
    legend: {
      show: false,
    },
    tooltip: {
      enabled: true,
      custom: function ({
        series,
        seriesIndex,
        w,
      }: {
        series: number[];
        seriesIndex: number;
        w: IW;
      }) {
        let total = 0;
        for (let x of series) {
          total += x;
        }
        let selected = series[seriesIndex];
        return `<div style="color: #898788" 
                      class="padding align-items-center justify-contents-center box box-shadow flex flex-column">
                        <span class="border-bottom">${
                          w.config.labels[seriesIndex]
                        }</span><strong>${
          ((selected / total) * 100).toFixed(2) + "%"
        }</strong></div>`;
      },
    },
    dataLabels: {
      enabledOnSeries: true,
      formatter: (val: number, opt: any) => {
        return opt.w.globals.labels[opt.seriesIndex];
      },
    },
  },
};

export default ChartOptions;
