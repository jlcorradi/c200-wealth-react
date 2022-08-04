import React from 'react';
import PortfolioSummaryIndicators from '../components/PortfolioSummaryIndicators';
import PortfolioWidget from '../components/PortfolioWidget';
import StockDonutChart from '../components/StockDonutChart';
import TabSet, { TabSheet } from '../components/TabSheet';
import { ArrayHelper } from '../Helpers';
import { usePortfolioStateContext } from '../store/PortfolioStateContext';
import DividendYieldService from '../services/DividendYieldService';
import moment from 'moment';
import DividendYieldEvolutionChart from '../components/DividendYieldEvolutionChart';
import DividendYieldOffCanva from '../components/DividendYieldOffCanva';
import PortfolioItem from '../components/PortfolioItem';
import DividendYieldList from '../components/DividendYieldList';
import StockOperationList from '../components/StockOperationList';
import OffCanva from '../template/OffCanva';
import WatchListList from '../components/WatchListList';
import DyMatrix from '../components/DyMatrix';

function InvestmentsView() {
  const [{ stocks, fiis, bySector }, portfolioDispatch] =
    usePortfolioStateContext();
  const [portfolioItemVisible, setPortfolioItemVisible] = React.useState(false);
  const [portfolioItemToShow, setPortfolioItemToShow] = React.useState({});
  const [totalDyLast12Months, setTodalDyLast12Months] = React.useState(0);

  let initDate = moment()
    .startOf('month')
    .subtract(11, 'months')
    .format('DD/MM/YYYY');
  let [dividendData, setDividendData] = React.useState({
    barSeries: [],
    monthArray: [],
  });
  let [monthToShowDetail, setMonthToShowDetail] = React.useState();
  let [dyOffcanvaVisible, setDyOffcanvaVisible] = React.useState(false);

  const [showStocksBySector, setShowStocksBySector] = React.useState(false);

  React.useEffect(() => {
    DividendYieldService.getDashboardData(
      initDate,
      moment().endOf('month').format('DD/MM/YYYY')
    ).then(({ data }) => {
      setDividendData(data);
      setTodalDyLast12Months(data.totalDividendsLast12Months);
    });
  }, []);

  React.useEffect(() => {
    portfolioDispatch({ type: 'LOAD' });
  }, []);

  let { monthArray, barSeries } = dividendData;

  function portfolioItemClick(item) {
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
                    symbol: 'Stock',
                    currentAmount: ArrayHelper.derivedSum(
                      stocks,
                      'currentAmount'
                    ),
                  },
                  {
                    symbol: 'FII',
                    currentAmount: ArrayHelper.derivedSum(
                      fiis,
                      'currentAmount'
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
                onSelectMonth={(month) => {
                  setMonthToShowDetail(month);
                  setDyOffcanvaVisible(true);
                }}
              />
            </div>
          </div>
          <div className="row margin-v">
            <div className="margin-v">
              <div className="title margin-bottom">
                <h3>Stocks Dividend Matrix</h3>
              </div>
              <DyMatrix category="STOCK"></DyMatrix>
            </div>

            <div className="margin-v">
              <div className="title margin-bottom">
                <h3>FIIS Dividend Matrix</h3>
              </div>
              <DyMatrix category="FII"></DyMatrix>
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
                  <label className="margin-left" for="scales">
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
