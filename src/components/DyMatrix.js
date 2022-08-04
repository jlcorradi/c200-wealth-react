import moment from 'moment';
import React from 'react';
import { NumberHelper } from '../Helpers';
import DividendYieldService from '../services/DividendYieldService';

function DyMatrix({ category }) {
  const [data, setData] = React.useState([]);

  React.useEffect(() => {
    DividendYieldService.get12MonthMatrix(category).then(({ data }) =>
      setData(data)
    );
  }, []);

  return (
    <table className="data-table">
      <thead>
        <th className='text=left'>Symbol</th>
        <th className='text-right'>{getMonth(6)}</th>
        <th className='text-right'>{getMonth(5)}</th>
        <th className='text-right'>{getMonth(4)}</th>
        <th className='text-right'>{getMonth(3)}</th>
        <th className='text-right'>{getMonth(2)}</th>
        <th className='text-right'>{getMonth(1)}</th>
      </thead>
      <tbody>
        {data.map((item, i) => (
          <tr key={i}>
            <th className='text=left'>{item.symbol}</th>
            <td className='text-right'>{NumberHelper.formatBRL(item.month06)}</td>
            <td className='text-right'>{NumberHelper.formatBRL(item.month05)}</td>
            <td className='text-right'>{NumberHelper.formatBRL(item.month04)}</td>
            <td className='text-right'>{NumberHelper.formatBRL(item.month03)}</td>
            <td className='text-right'>{NumberHelper.formatBRL(item.month02)}</td>
            <td className='text-right'>{NumberHelper.formatBRL(item.month01)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function getMonth(mo) {
  return moment().subtract(mo, 'month').format('MM/yy');
}

export default DyMatrix;
