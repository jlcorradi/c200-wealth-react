import React, { FC } from "react";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { NavLink } from "react-router-dom";
//@ts-ignore
import Interop from "../components/Interop";
//@ts-ignore
import Lists from "../components/Lists";

export const SystemView: FC<{}> = () => {
  return (
    <>
      <div className="titlebar">
        <h3>System Operations</h3>
        {/* <div className="buttons">
                    <a href="#new" ><i className='bx bx-add-to-queue' ></i>New</a>
                    <a href="#delete" ><i className='bx bxs-trash' ></i>Delete</a>
                </div> */}
      </div>

      <div className="flex flex-1 flex-row box shadow flex-row justify-content-stretch">
        <div className="flex flex-column flex-1 padding justify-content-stretch">
          <Switch>
            <Route path="/system/interop" component={Interop}></Route>
            <Route path="/system/lists" component={Lists}></Route>
          </Switch>
        </div>
      </div>
    </>
  );
};
