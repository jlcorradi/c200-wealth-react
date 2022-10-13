import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Irpf from '../components/Irpf';
import EmptyPlaceHolder from '../template/EmptyPlaceHolder';

function ReportingView() {
  return (
    <>
      <div className="titlebar">
        <h3>Reporting</h3>
      </div>
      <div className="box padding shadow flex flex-row justify-content-stretch">
        <div className="flex flex-column flex-1 padding justify-content-stretch">
          <Switch>
            <Route
              path="/reporting/"
              exact={true}
              render={() => (
                <div className="">
                  <EmptyPlaceHolder
                    icon="bx-check"
                    label="Please, Select an option"
                  ></EmptyPlaceHolder>
                </div>
              )}
            ></Route>
            <Route path="/reporting/irpf" component={Irpf}></Route>
          </Switch>
        </div>
      </div>
    </>
  );
}

export default ReportingView;
