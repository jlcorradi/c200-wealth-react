import React from 'react';
import { NumberHelper } from '../Helpers';

function PortfolioWidget({ stocks, showingBySector, onClickItem }) {
  function StockRow({ item }) {
    let delta = item.currentAmount - item.totalPrice;
    let rowClass = delta < 0 ? 'outcome' : 'income';
    return (
      <div
        onClick={() => (onClickItem ? onClickItem(item) : null)}
        className="highlight-hover flex padding flex-row flex-1 justify-content-space-between border-bottom"
      >
        {item.thumbImage && (
          <div
            className="flex flex-row align-items-center"
            style={{ width: '130px' }}
          >
            <img height={20} src={item.thumbImage} alt={item.symbol} />
          </div>
        )}
        <div className="flex flex-column flex-1">
          <small className="label">Ticker</small>
          <strong className={rowClass}>{item.symbol}</strong>
        </div>
        {/* <div className="flex flex-1 padding-h flex-column">
          <small className="label">Description</small>
          <strong className={rowClass}>{item.description}</strong>
        </div> */}
        {!showingBySector && (
          <>
            <div className="flex padding-h flex-column">
              <small className="label">Last Price</small>
              <strong>{NumberHelper.formatBRL(item.lastPrice)}</strong>
            </div>
            <div className="flex padding-h flex-column">
              <small className="label">Quantity</small>
              <strong>{item.quantity}</strong>
            </div>
          </>
        )}
        {/* <div className="flex padding-h flex-column">
          <small className="label">A. Average price</small>
          <strong className={rowClass}>{NumberHelper.formatBRL(item.adjustedAveragePrice)}</strong>
        </div> */}
        <div className="flex padding-h flex-column">
          <small className="label">Current Amount</small>
          <strong className={rowClass}>
            {NumberHelper.formatBRL(item.currentAmount)}
          </strong>
        </div>
        {!showingBySector && (
          <div className="flex padding-h flex-column w100">
            <small className="label">Delta</small>
            <strong className={rowClass}>
              {NumberHelper.formatPercent(
                ((item.currentAmount - item.totalPrice) / item.totalPrice) * 100
              )}
            </strong>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="padding-v flex-1">
      {stocks.map((item) => (
        <StockRow item={item} key={item.symbol} />
      ))}
    </div>
  );
}

export default PortfolioWidget;
