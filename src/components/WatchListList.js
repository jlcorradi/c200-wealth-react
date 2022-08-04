import React from 'react';
import {
  loadedAction,
  setToLoadAction,
  useWatchListContext,
} from '../store/WatchListStateProvider';
import QueryService from '../services/QueryService';
import WatchListService from '../services/WatchListService';
import OffCanva from '../template/OffCanva';
import FormWithValidation from './FormWithValidation';
import { required, ruleRunner } from '../Validatoion';
import { NumberHelper } from '../Helpers';

const formConfig = {
  fields: [
    {
      field: 'symbol',
      rowGroup: 'stock',
      label: 'Symbol',
      cssClass: 'w100',
      onBlur: (e, onChange) => {
        if (e.target.length < 4) {
          return;
        }
        QueryService.query(
          'StockEntity',
          { symbol: e.target.value.toUpperCase() },
          'symbol'
        ).then(({ data }) => {
          if (data.content.length > 0) {
            onChange('description', data.content[0].description);
          }
        });
      },
    },
    {
      field: 'description',
      rowGroup: 'stock',
      label: 'Description',
      disabled: true,
    },
    { field: 'lowerTarget', rowGroup: 'target', label: 'Lower Target' },
    {
      field: 'upperTarget',
      rowGroup: 'target',
      cssClass: 'flex-1',
      label: 'Upper Target',
    },
  ],
  validationRules: [
    ruleRunner('symbol', 'Symbol', required),
    ruleRunner('lowerTarget', 'lowerTarget', required),
    ruleRunner('upperTarget', 'upperTarget', required),
  ],
};

// TODO: make validation Rules dynamic

function WatchListList() {
  const [{ isLoading, watchListList, order }, dispatch] = useWatchListContext();
  const [instanceVisible, setInstanceVisible] = React.useState(false);
  const [itemToEdit, setItemToEdit] = React.useState();

  React.useEffect(() => {
    if (isLoading) {
      QueryService.query('StockWatchListEntity', {}, order, 0, 300).then(
        ({ data }) => {
          dispatch(loadedAction(data.content));
        }
      );
    }
  }, [isLoading]);

  return (
    <>
      <div className="padding lex flex-row">
        <div className="titlebar border-bottom">
          <div className="buttons">
            <a
              href="#add"
              onClick={(e) => {
                e.preventDefault();
                setItemToEdit({
                  symbol: '',
                  description: '',
                  lowerTarget: '',
                  upperTarget: '',
                  active: true,
                });
                setInstanceVisible(true);
              }}
            >
              <i className="bx bx-add-to-queue"></i>
              <span>Add Alarm</span>
            </a>
          </div>
        </div>
        {watchListList.map((item, index) => (
          <WatchListItem
            item={item}
            key={index}
            onEditClick={(item) => {
              setInstanceVisible(true);
              setItemToEdit(item);
            }}
          />
        ))}
      </div>
      <OffCanva
        visible={instanceVisible}
        onDismiss={() => setInstanceVisible(false)}
      >
        <div className="titlebar">
          <h3>Alarm</h3>
        </div>
        <FormWithValidation
          modelToEdit={itemToEdit}
          config={formConfig}
          onDismiss={() => setInstanceVisible(false)}
          onSubmit={async (model) => {
            setInstanceVisible(false);
            await WatchListService.save(model);
            dispatch(setToLoadAction());
          }}
        ></FormWithValidation>
      </OffCanva>
    </>
  );
}

function WatchListItem({ item, onEditClick }) {
  const [, dispatch] = useWatchListContext();
  return (
    <div className="flex flex-column">
      <div className="flex flex-row padding-v highlight-hover">
        <div className="flex flex-row align-items-center" style={{width: "140px"}}>
          <img height={20} src={item.thumbImage} alt={item.symbol} />
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Stock</small>
          <div>{item.symbol}</div>
        </div>
        <div className="flex flex-column padding-h flex-1">
          <small className="label">Description</small>
          <div>{item.description}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Current Price</small>
          <div>{NumberHelper.formatBRL(item.currentPrice)}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Lower Target</small>
          <div>{NumberHelper.formatBRL(item.lowerTarget)}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Upper Target</small>
          <div>{NumberHelper.formatBRL(item.upperTarget)}</div>
        </div>
        <div className="flex flex-column padding-h">
          <small className="label">Active</small>
          <div>{item.active ? 'Yes' : 'No'}</div>
        </div>
        <div className="flex flex-column padding-h">
          <div className="buttons padding">
            <a
              href="#edit"
              className="info"
              onClick={(e) => {
                e.preventDefault();
                onEditClick(item);
              }}
            >
              <i className="bx bx-pencil"></i>
            </a>
            <a
              href="#delete"
              className="danger"
              onClick={async (e) => {
                e.preventDefault();
                if (!window.confirm('Delete alarm?')) {
                  return;
                }
                await WatchListService.delete(item.id);
                dispatch(setToLoadAction());
              }}
            >
              <i className="bx bx-trash"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WatchListList;
