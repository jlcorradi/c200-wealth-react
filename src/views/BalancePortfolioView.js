import React, {useEffect, useRef} from 'react';
import Chart from 'react-apexcharts';
import {NotificationManager} from 'react-notifications';
import {useParams, Route, NavLink} from 'react-router-dom';
import LoaderAndEmptyWrapper from '../components/LoaderAndEmptyWrapper';
import SimpleTable from '../components/SimpleTable';
import PortfolioTemplateService from '../services/PortfolioTemplateService';
import {usePortfolioTemplateContext} from '../store/PortfolioTemplateContext';

function BalancePortfolioView() {
  const [{templates}, dispatch] = usePortfolioTemplateContext();
  const newTypeSelect = useRef();
  const newDescription = useRef();

  function createNewTemplate() {
    // Create new
    if (!newTypeSelect.current.value) {
      NotificationManager.warning('New Type cannot be null');
      return;
    }
    if (!newDescription.current.value) {
      NotificationManager.warning('New Description cannot be null');
      return;
    }

    PortfolioTemplateService.save({
      category: newTypeSelect.current.value,
      description: newDescription.current.value,
    }).then(({data}) => {
      dispatch({type: 'NEW_TEMPLATE_ADDED', payload: data});
      newTypeSelect.current.value = null;
      newDescription.current.value = '';
    });
  }

  return (
    <>
      <div className="titlebar">
        <h3>Balance your portfolio</h3>
      </div>

      <div className="box shadow flex flex-row">
        <div className="flex flex-column w400 border-right padding">
          <strong>Available Templates</strong>
          <ul className="padding-v vertical">
            {templates.map((item, i) => (
              <li key={i}>
                <NavLink
                  to={`/balance-portfolio/portfolio-template/${item.id}`}>
                  {item.description}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-row">
            <div className="form-group">
              <select name="category" id="newCategory" ref={newTypeSelect}>
                <option value="STOCK">Stocks</option>
                <option value="FII">FIIs</option>
              </select>
            </div>
            <div className="form-group margin-left flex-1">
              <input
                type="text"
                name="description"
                id="newDescription"
                ref={newDescription}
                placeholder="New Template Description"
              />
            </div>
          </div>
          <button className="btn" onClick={createNewTemplate}>
            Add new
          </button>
        </div>
        <div className="flex flex-1 padding ">
          <Route
            exact
            path="/balance-portfolio/portfolio-template/:id"
            component={TemplateInstance}
          />
        </div>
      </div>
    </>
  );
}

function TemplateInstance({props}) {
  let {id} = useParams();
  const [
    {templates, currentTemplate, currentTemplateAssets, loading},
    dispatch,
  ] = usePortfolioTemplateContext();
  const newSymbol = useRef();
  const newWeight = useRef();

  function loadAssets() {
    PortfolioTemplateService.loadAssets(id).then(({data}) =>
      dispatch({
        type: 'SET_CURRENT_TEMPLATE_ASSETS',
        payload: data,
      }),
    );
  }

  function deleteAsset(asset) {
    PortfolioTemplateService.delete(id, asset.id).then(loadAssets);
  }

  useEffect(() => {
    if (id) {
      dispatch({
        type: 'SET_CURRENT_TEMPLATE',
        payload: templates.filter(i => i.id.toString() === id)[0],
      });
      loadAssets();
    }
  }, [id]);

  function addAsset() {
    if (!newSymbol.current.value) {
      NotificationManager.warning('New Symbol is required');
      return;
    }

    if (!newWeight.current.value) {
      NotificationManager.warning('New Weight is required');
      return;
    }

    PortfolioTemplateService.addAsset(id, {
      symbol: newSymbol.current.value.toUpperCase(),
      weight: Number.parseFloat(newWeight.current.value),
    }).then(({data}) => {
      loadAssets();
      newSymbol.current.value = '';
      newWeight.current.value = '';
    });
  }

  function simulate(e) {
    e.preventDefault();
  }

  return (
    <>
      <LoaderAndEmptyWrapper
        isEmpty={!currentTemplate.description}
        isLoading={loading}>
        <div className="flex flex-1 flex-column align-items-start justify-content-flex-start">
          <div className="titlebar">
            <h3>{currentTemplate.description}</h3>
            <div className="buttons">
              <a href="#a" onClick={simulate}>
                <i class="bx bx-calculator"></i>Simulate Operations
              </a>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-column flex-1">
              <SimpleTable
                fields={['symbol', 'weight']}
                onDelete={deleteAsset}
                labels={['Ticker', 'Weight']}
                items={currentTemplateAssets}
              />

              <div className="flex flex-row margin-v">
                <div className="form-group flex-1">
                  <input
                    type="text"
                    placeholder="New Asset Symbol"
                    ref={newSymbol}
                  />
                </div>
                <div className="form-group margin-left">
                  <input
                    type="text"
                    placeholder="New Asset weight"
                    ref={newWeight}
                  />
                </div>
                <div className="margin-left">
                  <button className="btn" onClick={addAsset}>
                    Add
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-column flex-1">
              <div className="w400">
                <Chart
                  type="donut"
                  options={{
                    labels: currentTemplateAssets.map(i => i.symbol),
                  }}
                  series={currentTemplateAssets.map(i => i.weight)}></Chart>
              </div>
            </div>
          </div>
        </div>
      </LoaderAndEmptyWrapper>
    </>
  );
}

export default BalancePortfolioView;
