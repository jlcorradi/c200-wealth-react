import React from 'react';
import { ArrayHelper } from '../Helpers';
import { ReportingService } from '../services/ReportingService';
import LoaderAndEmptyWrapper from './LoaderAndEmptyWrapper';
import SimpleTable from './SimpleTable';

function Irpf() {
  const [year, setYear] = React.useState();
  const [payload, setPayload] = React.useState({
    rendmentInformList: [],
    taxeable10: [],
    nonTaxeable09: [],
    irpfTaxeableCommonOperations: {},
    irpfFiiOperations: {},
    irpfDayTradeProfitLoss: {},
    irpfExemptCommonOperations: {}
  });
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (year) {
      setIsLoading(true);
      ReportingService.rendimentInform(year)
        .then(({ data }) => {
          setPayload(data);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [year]);

  const {
    rendmentInformList,
    taxeable10,
    nonTaxeable09,
    irpfTaxeableCommonOperations,
    irpfFiiOperations,
    irpfExemptCommonOperations,
    irpfDayTradeProfitLoss,
  } = payload;

  return (
    <>
      <div className="titlebar border-bottom">
        <h3>Rendiment Inform</h3>
        <div className="buttons">
          <div className="w200">
            <select
              placeholder="Select Year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="" disabled selected>
                Select Year
              </option>
              <option value="2019">2019</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </div>
      </div>
      <LoaderAndEmptyWrapper
        emptyIcon="bx-confused"
        isEmpty={!!!year || payload.length === 0}
        isLoading={isLoading}
      >
        <div className="margin-top">
          <h4 className="padding margin-bottom border-bottom">
            Bens e Direitos
          </h4>
          <SimpleTable
            labels={[
              'Symbol',
              'Description',
              `Quantity in ${year - 1}`,
              `Amount in ${year - 1}`,
              `Quantity in ${year}`,
              `Amount in ${year}`,
            ]}
            fields={[
              'symbol',
              'description',
              'quantityPreviousYear',
              'amountPreviousYear:toBRL',
              'quantityVigencyYear',
              'amountVigencyYear:toBRL',
              '',
            ]}
            items={rendmentInformList}
            total={ArrayHelper.derivedSum(
              rendmentInformList,
              'amountVigencyYear'
            )}
          ></SimpleTable>
        </div>
        <div className="margin-top">
          <h4 className="padding margin-bottom border-bottom">
            Rendimentos não tributáveis: 09 - Lucros e dividendos recebidos
          </h4>
          <SimpleTable
            fields={['description', 'amount:toBRL']}
            labels={['Description', 'Amount']}
            totalField="amount"
            items={ArrayHelper.sortAscending(
              ArrayHelper.resolveArrayOfObjectsFromProperties(
                nonTaxeable09,
                'description',
                'amount'
              ),
              'description'
            )}
          ></SimpleTable>
        </div>

        <div className="margin-top">
          <h4 className="padding margin-bottom border-bottom">
            Rendimentos sujeitos a tributação exclusiva/definitiva: 10 - Juros
            sobre capital próprio
          </h4>
          <SimpleTable
            fields={['description', 'amount:toBRL']}
            labels={['Description', 'Amount']}
            totalField="amount"
            items={ArrayHelper.sortAscending(
              ArrayHelper.resolveArrayOfObjectsFromProperties(
                taxeable10,
                'description',
                'amount'
              ),
              'description'
            )}
          ></SimpleTable>
        </div>

        <div className="margin-top">
          <h4 className="padding margin-bottom border-bottom">
            Operações comuns no mercado de ações
          </h4>
          <SimpleTable
            fields={['month', 'amount:toBRL']}
            labels={['month', 'Amount']}
            totalField="amount"
            items={ArrayHelper.sortAscending(
              ArrayHelper.resolveArrayOfObjectsFromProperties(
                irpfTaxeableCommonOperations,
                'month',
                'amount'
              ),
              'month'
            )}
          ></SimpleTable>
        </div>

        <div className="margin-top">
          <h4 className="padding margin-bottom border-bottom">
            Operações comuns no mercado de FIIS
          </h4>
          <SimpleTable
            fields={['month', 'amount:toBRL']}
            labels={['month', 'Amount']}
            totalField="amount"
            items={ArrayHelper.sortAscending(
              ArrayHelper.resolveArrayOfObjectsFromProperties(
                irpfFiiOperations,
                'month',
                'amount'
              ),
              'month'
            )}
          ></SimpleTable>
        </div>

        <div className="margin-top">
          <h4 className="padding margin-bottom border-bottom">
            20 - Ganhos liquidos Operações Comuns até 20 mil reais
          </h4>
          <SimpleTable
            fields={['month', 'amount:toBRL']}
            labels={['month', 'Amount']}
            totalField="amount"
            items={ArrayHelper.sortAscending(
              ArrayHelper.resolveArrayOfObjectsFromProperties(
                irpfExemptCommonOperations,
                'month',
                'amount'
              ),
              'month'
            )}
          ></SimpleTable>
        </div>
      </LoaderAndEmptyWrapper>
    </>
  );
}

export default Irpf;
