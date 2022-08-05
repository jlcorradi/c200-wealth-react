import React from "react";
import PortfolioSummaryIndicators from "../components/PortfolioSummaryIndicators";
// @ts-ignore
import PortfolioWidget from "../components/PortfolioWidget";
// @ts-ignore
import StockDonutChart from "../components/StockDonutChart";
// @ts-ignore
import TabSet, { TabSheet } from "../components/TabSheet";
import { ArrayHelper } from "../Helpers";
import { usePortfolioStateContext } from "../store/PortfolioStateContext";
import DividendYieldService from "../services/DividendYieldService";
import moment from "moment";
// @ts-ignore
import DividendYieldEvolutionChart from "../components/DividendYieldEvolutionChart";
// @ts-ignore
import DividendYieldOffCanva from "../components/DividendYieldOffCanva";
import PortfolioItem from "../components/PortfolioItem";
// @ts-ignore
import DividendYieldList from "../components/DividendYieldList";
// @ts-ignore
import StockOperationList from "../components/StockOperationList";
// @ts-ignore
import OffCanva from "../template/OffCanva";
// @ts-ignore
import WatchListList from "../components/WatchListList";
import { IPortfolioEntity } from "../types/portfolio";

function InvestmentsView() {
  // @ts-ignore
  const { state, dispatch } = usePortfolioStateContext();
  const { stocks, fiis, bySector } = state;

  const [portfolioItemVisible, setPortfolioItemVisible] = React.useState(false);
  const [portfolioItemToShow, setPortfolioItemToShow] =
    React.useState<IPortfolioEntity>({} as unknown as IPortfolioEntity);
  const [totalDyLast12Months, setTodalDyLast12Months] = React.useState(0);

  let initDate = moment()
    .add("month", -1)
    .startOf("month")
    .subtract(11, "months")
    .format("DD/MM/YYYY");
  let [dividendData, setDividendData] = React.useState({
    barSeries: [],
    monthArray: [],
  });
  let [monthToShowDetail, setMonthToShowDetail] = React.useState<string>();
  let [dyOffcanvaVisible, setDyOffcanvaVisible] =
    React.useState<boolean>(false);

  const [showStocksBySector, setShowStocksBySector] = React.useState(false);

  React.useEffect(() => {
    DividendYieldService.getDashboardData(
      initDate,
      moment().add("month", -1).endOf("month").format("DD/MM/YYYY")
    ).then(({ data }) => {
      setDividendData(data);
      setTodalDyLast12Months(data.totalDividendsLast12Months);
    });
  }, []);

  React.useEffect(() => {
    dispatch({ type: "LOAD" });
  }, []);

  let { monthArray, barSeries } = dividendData;

  function portfolioItemClick(item: IPortfolioEntity) {
    console.log(item);
    setPortfolioItemToShow(item);
    setPortfolioItemVisible(true);
  }

  return (
    <>
      <div className="titlebar">
        <h3>Portfolio</h3>
      </div>

      <div className="flex flex-row box shadow">
        <PortfolioSummaryIndicators
          avgMonthlyDividend={totalDyLast12Months / 12}
        />
      </div>

      <TabSet className="shadow">
        <TabSheet label="Summary">
          <div className="flex flex-row margin-v border-bottom">
            <div className="flex flex-column flex-1  align-items-center border-right">
              <div className="title">
                <h3>Distribuition</h3>
              </div>
              <StockDonutChart
                width="380"
                stocks={[
                  {
                    symbol: "Stock",
                    currentAmount: ArrayHelper.derivedSum(
                      stocks,
                      "currentAmount"
                    ),
                  },
                  {
                    symbol: "FII",
                    currentAmount: ArrayHelper.derivedSum(
                      fiis,
                      "currentAmount"
                    ),
                  },
                ]}
              />
            </div>
            <div className="flex flex-column flex-1 align-items-center">
              <div className="title">
                <h3>Dividend Evolution</h3>
              </div>
              <DividendYieldEvolutionChart
                monthArray={monthArray}
                barSeries={barSeries}
                onSelectMonth={(month: string) => {
                  setMonthToShowDetail(month);
                  setDyOffcanvaVisible(true);
                }}
              />
            </div>
          </div>
        </TabSheet>
        <TabSheet label="Portfolio">
          <div className="flex flex-row">
            <div className="flex flex-column flex-1 padding border-right">
              <div className="titlebar">
                <h3>Stocks</h3>
                <div>
                  <input
                    type="checkbox"
                    id="scales"
                    name="scales"
                    checked={showStocksBySector}
                    onChange={(e) => setShowStocksBySector(e.target.checked)}
                  />
                  <label className="margin-left" htmlFor="scales">
                    Group By Sector
                  </label>
                </div>
              </div>
              <div className="flex flex-row justify-content-center">
                <StockDonutChart
                  width="380"
                  stocks={showStocksBySector ? bySector : stocks}
                  onItemClick={portfolioItemClick}
                />
              </div>
              <div className="flex flex-row flex-1">
                <PortfolioWidget
                  showingBySector={showStocksBySector}
                  stocks={showStocksBySector ? bySector : stocks}
                  onClickItem={portfolioItemClick}
                />
              </div>
            </div>
            <div className="flex flex-column flex-1 padding">
              <div className="titlebar">
                <h3>FIIs</h3>
              </div>
              <div className="flex flex-row justify-content-center">
                <StockDonutChart
                  width="380"
                  stocks={fiis}
                  onItemClick={portfolioItemClick}
                />
              </div>
              <div className="flex flex-row flex-1">
                <PortfolioWidget
                  stocks={fiis}
                  onClickItem={portfolioItemClick}
                />
              </div>
            </div>
          </div>
        </TabSheet>
        <TabSheet label="Yields">
          <div className="flex flex-column">
            <DividendYieldList />
          </div>
        </TabSheet>
        <TabSheet label="Operations">
          <div className="flex flex-column">
            <StockOperationList />
          </div>
        </TabSheet>
        <TabSheet label="Alarms">
          <div className="flex flex-column">
            <WatchListList></WatchListList>
          </div>
        </TabSheet>
      </TabSet>

      <DividendYieldOffCanva
        monthToShow={monthToShowDetail}
        onDismiss={() => setDyOffcanvaVisible(false)}
        visible={dyOffcanvaVisible}
      />

      <OffCanva
        visible={portfolioItemVisible}
        item={portfolioItemToShow}
        onDismiss={() => setPortfolioItemVisible(false)}
      >
        <PortfolioItem item={portfolioItemToShow} />
      </OffCanva>
    </>
  );
}

export default InvestmentsView;
