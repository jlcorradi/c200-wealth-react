import classNames from 'classnames';
import React from 'react';
import {ArrayHelper, NumberHelper} from '../Helpers';

function SimpleTable({
  labels,
  fields,
  items,
  total,
  totalField,
  groupingField,
  groupingTotalField,
  getRowClass,
  onDelete,
  onEdit,
  renderColumn,
}) {
  function formatItem(item, field) {
    let meta = field.split(':');
    let value = item[meta[0]];
    if (meta.length === 1) {
      return value;
    }

    switch (meta[1]) {
      case 'toBRL':
        return Number.parseFloat(value).toLocaleString('pt-br', {minimumFractionDigits: 2});
      case 'percent':
        return Number.parseFloat(value).toLocaleString('pt-br', {maximumSignificantDigits: 2}) + '%';
      default:
        return item;
    }
  }

  function isNumber(item, field) {
    let meta = field.split(':');
    let value = item[meta[0]];
    return typeof value === 'number';
  }

  let currentGroup = '';

  function getGroupingTotal(group) {
    return items.filter((i) => i[groupingField] === group).reduce((curr, next) => curr + next[groupingTotalField], 0);
  }

  let nextGroupToToTotalize = '';

  function renderGroupLable(theItem) {
    if (currentGroup !== theItem[groupingField]) {
      currentGroup = theItem[groupingField];

      if (groupingTotalField) {
        nextGroupToToTotalize = currentGroup;
      }

      return (
        <>
          <tr>
            <td colSpan={getNumberOfColumns()}>
              <strong>{currentGroup}</strong>
            </td>
          </tr>
        </>
      );
    }

    return <></>;
  }

  function getNumberOfColumns() {
    let num = fields.length;
    if (onDelete) {
      num++;
    }

    return num;
  }

  function renderGroupTotal(theItem) {
    if (currentGroup === '') {
      return;
    }
    if (!theItem || theItem[groupingField] !== nextGroupToToTotalize) {
      return (
        <tr>
          <td colSpan={getNumberOfColumns() - 1}>SubTotal</td>
          <td className="text-right">{NumberHelper.formatBRL(getGroupingTotal(nextGroupToToTotalize))}</td>
        </tr>
      );
    }
  }

  return (
    <table className="data-table">
      <tr>
        {labels.map((l) => (
          <th key={l}>{l}</th>
        ))}
        {onDelete && <td></td>}
      </tr>
      {items.map((theItem, idx) => (
        <>
          {groupingField && groupingTotalField && renderGroupTotal(theItem)}
          {groupingField && renderGroupLable(theItem)}
          <tr key={idx} className={getRowClass && getRowClass(theItem)}>
            {fields.map((theField, theIndex) => {
              return renderColumn ? (
                renderColumn(theField, theItem)
              ) : (
                <td className={classNames({'text-right': isNumber(theItem, theField)})} key={theIndex}>
                  {formatItem(theItem, theField)}
                </td>
              );
            })}

            {onDelete && (
              <td>
                <a
                  href="#delete"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Delete Record?')) {
                      onDelete(theItem);
                    }
                  }}>
                  <i className="bx bx-trash"></i>
                </a>
              </td>
            )}

            {onEdit && (
              <td>
                <a
                  href="#edit"
                  onClick={(e) => {
                    e.preventDefault();
                    onEdit(theItem);
                  }}>
                  <i className="bx bx-pencil"></i>
                </a>
              </td>
            )}
          </tr>
        </>
      ))}
      {groupingField && groupingTotalField && renderGroupTotal()}
      {total > 0 && (
        <tr>
          <td colSpan={labels.length - 1}>Total: </td>
          <td className="text-right">
            <strong>{total.toLocaleString('pt-br', {minimumFractionDigits: 2})}</strong>
          </td>
        </tr>
      )}
      {totalField && (
        <tr>
          <td colSpan={labels.length - 1}>Total: </td>
          <td className="text-right">
            <strong>{ArrayHelper.derivedSum(items, totalField).toLocaleString('pt-br', {minimumFractionDigits: 2})}</strong>
          </td>
        </tr>
      )}
    </table>
  );
}

export default SimpleTable;
