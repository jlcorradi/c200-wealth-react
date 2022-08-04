import React from 'react';
import { NotificationManager } from 'react-notifications';
import KeyValuePairService from '../services/KeyValuePairService';
import LoaderAndEmptyWrapper from './LoaderAndEmptyWrapper';

function Lists() {
  const [listType, setListType] = React.useState();
  const [list, setList] = React.useState([]);
  const newItemInput = React.useRef();

  React.useEffect(() => {
    if (listType) {
      reload();
    }
  }, [listType]);

  function addNewSubmit(e) {
    e.preventDefault();
    if (!newItemInput.current.value) {
      NotificationManager.error('Item Description is required');
      return;
    }

    KeyValuePairService.add(listType, newItemInput.current.value).finally(
      reload
    );
    newItemInput.current.value = '';
    reload();
  }

  function deleteItem(id) {
    KeyValuePairService.delete(id).finally(reload);
  }

  function reload() {
    KeyValuePairService.list(listType).then(({ data }) => setList(data));
  }

  return (
    <>
      <div className="titlebar border-bottom">
        <h3>Lists</h3>
        <div className="w200">
          <select
            placeholder="Select list type"
            value={listType}
            onChange={(e) => setListType(e.target.value)}
          >
            <option value="" disabled selected>
              Select List Type
            </option>
            <option value="INCOME_EXPENSE_CATEGORY">
              Income/Expense Category
            </option>
          </select>
        </div>
      </div>
      <LoaderAndEmptyWrapper isEmpty={!listType}>
        <form onSubmit={addNewSubmit}>
          <div className="flex flex-1 flex-row  margin-top">
            <div className="form-control flex-1">
              <input
                type="text"
                placeholder={`Add new ${listType}`}
                ref={newItemInput}
              />
            </div>
            <button className="btn">Add Item</button>
          </div>
        </form>

        <div className="flex flex-1 flex-row justify-content-stretch margin-top border-top padding-v">
          <table className="data-table">
            <thead>
              <tr>
                <th>Description</th>
                <th className="text-right">Operations</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item, idx) => (
                <tr>
                  <td>{item.description}</td>
                  <td className="text-right">
                    <a
                      href="#delete"
                      className="danger"
                      onClick={(e) => {
                        e.preventDefault();
                        if (window.confirm(`Delete ${item.description}?`)) {
                          deleteItem(item.id);
                        }
                      }}
                    >
                      <i className="bx bx-trash"></i>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LoaderAndEmptyWrapper>
    </>
  );
}

export default Lists;
