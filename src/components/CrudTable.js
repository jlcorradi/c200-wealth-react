import classNames from 'classnames';
import React from 'react';
import { NumberHelper } from '../Helpers';
import LoadMoreButton from './LoadMoreButton';
import OrderToggle from './OrderToggle';
import Popup from './Popup';

// let config = {
//   fields: [
//     {
//       field: 'id',
//       functionalField: 'stock.symbol',
//       label: '#',
//       format: 'brl',
//       allowSort: true,
//       allowFilter: true,
//       filterType: 'String', DATE_RANGE | NUMBER_RANGE | DEFAULT | LIKE,
//       className: 'class',
//       renderFilterEditor: ({fieldFilterValue, onChange}) = ;
//       onRenderColumn: (item) => {},
//       getRowCssClass: (item) => {return ''}
//     }
//   ]
// }

function getFunctionalField(field) {
  return field.functionalField || field.field;
}

function CrudTable({
  items,
  filter,
  order,
  hasMore,
  config,
  page,
  onPageChange,
  onEditClick,
  onDeleteClick,
  onChangeOrder,
  onChangeFilter,
  renderFooter,
}) {
  function formatField(item, field) {
    let value = item[field.field];
    switch (field.format) {
      case 'brl':
        return NumberHelper.formatBRL(value);
      case 'percent':
        return NumberHelper.formatPercent(value);
      default:
        return value;
    }
  }

  const Header = ({ field }) => {
    let functionalField = getFunctionalField(field);
    let fieldLabel = field.label ? field.label : field.field;
    let content =
      onChangeOrder && field.allowSort ? (
        <OrderToggle
          description={fieldLabel}
          field={getFunctionalField(field)}
          order={order}
          onChange={onChangeOrder}
        ></OrderToggle>
      ) : (
        fieldLabel
      );

    let className = field.className ? field.className : 'text-left';

    let [filterVisible, setFilterVisible] = React.useState(false);

    let filterIcon = field.allowFilter && onChangeFilter && (
      <span style={{ position: 'relative' }}>
        <i
          onClick={() => setFilterVisible(!filterVisible)}
          className={classNames('button-icon bx bx-filter', {
            active: filter[functionalField],
          })}
        ></i>
        {
          <Popup visible={filterVisible}>
            <div className="popup-title">
              <span>{field.label}</span>
              <span
                className="popup-close"
                onClick={() => setFilterVisible(false)}
              >
                <i className="bx bx-x"></i>
              </span>
            </div>
            <FilterEditor
              field={field}
              onChange={(newFilter) => {
                onChangeFilter(newFilter);
                setFilterVisible(false);
              }}
            />
          </Popup>
        }
      </span>
    );

    return (
      <th className={className}>
        {filterIcon}
        {content}
      </th>
    );
  };

  const Row = ({ item }) => {
    let rowClass = config.getRowCssClass ? config.getRowCssClass(item) : '';
    return (
      <tr className={rowClass}>
        {config.fields.map((field, idx) => (
          <td key={idx} className={field.className}>
            {field.onRenderColumn
              ? field.onRenderColumn(item)
              : formatField(item, field)}
          </td>
        ))}
        {(onEditClick || onDeleteClick) && (
          <td className="text-right">
            {onEditClick && (
              <a
                href="#edit"
                onClick={(e) => {
                  e.preventDefault();
                  onEditClick(item);
                }}
              >
                <i className="bx bx-pencil"></i>
              </a>
            )}
            {onDeleteClick && (
              <a
                href="#delete"
                className="danger"
                onClick={(e) => {
                  e.preventDefault();
                  onDeleteClick(item);
                }}
              >
                <i className="bx bx-trash"></i>
              </a>
            )}
          </td>
        )}
      </tr>
    );
  };

  const FilterEditor = ({ field, onChange }) => {
    let functionalField = getFunctionalField(field);
    const [fieldFilterValue, setFieldFilterValue] = React.useState([]);

    React.useEffect(() => {
      if (filter) {
        setFieldFilterValue(filter[getFunctionalField(field)]);
      }
    }, [filter]);

    let editor;
    if (field.renderFilterEditor) {
      editor = field.renderFilterEditor(fieldFilterValue, setFieldFilterValue);
    } else {
      switch (field.filterType) {
        case 'DATE_RANGE':
        case 'NUMBER_RANGE':
          editor = (
            <RangeEditor
              fieldFilterValue={fieldFilterValue}
              onChange={setFieldFilterValue}
            />
          );
          break;
        case 'LIKE':
          editor = (
            <TextLikeEditor
              fieldFilterValue={fieldFilterValue}
              onChange={setFieldFilterValue}
            />
          );
          break;
        default:
          editor = (
            <TextEqualEditor
              fieldFilterValue={fieldFilterValue}
              onChange={setFieldFilterValue}
            />
          );
      }
    }

    return (
      <div className="flex flex-column">
        {editor}
        <div className="flex flex-row flex-1 justify-content-end margin-top">
          <button
            className="btn btn-info"
            onClick={(e) => {
              let newFilter = filter;
              newFilter[functionalField] = fieldFilterValue;
              onChange(newFilter);
            }}
          >
            <i className="bx bx-check"></i>Apply
          </button>
        </div>
      </div>
    );
  };

  function resulveFullColSpan() {
    let span = config.fields.length;
    if (onEditClick) {
      span++;
    }
    if (onDeleteClick) {
      span++;
    }
    return span;
  }

  function FilterPill({ field }) {
    const [fieldCfg] = config.fields.filter(
      (f) => getFunctionalField(f) === field
    );
    return (
      <span className="filter-pill">
        {fieldCfg.label}: {filter[field].join(', ')}
        <span
          className="filter-pill-remove"
          onClick={(e) => {
            let newFilter = filter;
            delete newFilter[field];
            onChangeFilter(newFilter);
          }}
        >
          <i className="bx bx-trash"></i>
        </span>
      </span>
    );
  }

  return (
    <>
      <div className="flex flex-row flex-wrap">
        {filter &&
          Object.keys(filter).map((f, idx) => (
            <FilterPill field={f} key={idx} />
          ))}
      </div>
      <table className="data-table">
        <thead>
          <tr>
            {config.fields.map((field) => (
              <Header key={field.field} field={field} />
            ))}
            {(onEditClick || onDeleteClick) && (
              <th className="text-right">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <Row key={idx} item={item}></Row>
          ))}
        </tbody>
        <tfoot>
          {renderFooter && (
            <tr>
              <td colSpan={resulveFullColSpan()}>{renderFooter()}</td>
            </tr>
          )}
          {onPageChange && (
            <tr>
              <td colSpan={resulveFullColSpan()} className="text-center">
                <LoadMoreButton
                  enabled={hasMore}
                  onClick={() => onPageChange(++page)}
                />
              </td>
            </tr>
          )}
        </tfoot>
      </table>
    </>
  );
}

const TextEqualEditor = ({ fieldFilterValue, onChange }) => {
  const [value] = fieldFilterValue ? fieldFilterValue : [''];
  return (
    <div className="w200 form-group">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange([e.target.value.toUpperCase()])}
      />
    </div>
  );
};

const TextLikeEditor = ({ fieldFilterValue, onChange }) => {
  const [value] = fieldFilterValue ? fieldFilterValue : [''];

  return (
    <div className="w200 form-group">
      <input
        type="text"
        value={('' + value).replaceAll('*', '')}
        onChange={(e) => onChange([`*${e.target.value}*`])}
      />
    </div>
  );
};

const RangeEditor = ({ fieldFilterValue, onChange }) => {
  const [startValue, endValue] = fieldFilterValue ? fieldFilterValue : ['', ''];
  return (
    <div className="flex w200 flex-column">
      <input
        type="text"
        value={startValue}
        onChange={(e) => onChange([e.target.value, endValue])}
      />
      <span className="padding">To</span>
      <input
        type="text"
        value={endValue}
        onChange={(e) => onChange([startValue, e.target.value])}
      />
    </div>
  );
};

export default CrudTable;
