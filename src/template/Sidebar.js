import classNames from 'classnames';
import React, { useState } from 'react';
import { GlobalActions, useGlobalState } from '../store/GlobalStateContext';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  const [{ isSidebarActive }, dispatch] = useGlobalState();

  function close() {
    dispatch(GlobalActions.toggleSidebarActive(false));
  }

  return (
    <div
      className={classNames('sidebar', { 'sidebar-active': isSidebarActive })}
    >
      <div className="logo">
        <i className="bx bx-line-chart"></i>
        <span>C200-WEALTH</span>
      </div>
      <i className="bx bx-x" id="btnCloseSidebar" onClick={close}></i>
      <ul className="sidebar-menu">
        <li className="menu">
          <NavLink onClick={close} to="/dashboard" activeClassName="active">
            <i className="bx bxs-dashboard"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>
        <li className="menu">
          <NavLink onClick={close} to="/investments" activeClassName="active">
            <i className="bx bx-line-chart"></i>
            <span>Investments</span>
          </NavLink>
        </li>
        <Submenu icon="bx-money" label="Cashflow">
          <li>
            <NavLink onClick={close} to="/expense-incomes">
              Expenses / Income
            </NavLink>
          </li>
          <li>
            <NavLink onClick={close} to="/recurring-expense-incomes">
              Recurring
            </NavLink>
          </li>
        </Submenu>
        <Submenu icon="bx-printer" label="Reporting">
          <li>
            <NavLink onClick={close} to="/reporting/irpf">
              IRPF
            </NavLink>
          </li>
          <li>
            <NavLink onClick={close} to="/reporting/other">
              Other
            </NavLink>
          </li>
        </Submenu>
        <Submenu icon="bx-cog" label="System">
          <li>
            <NavLink onClick={close} to="/system/lists">
              Lists
            </NavLink>
          </li>
          <li>
            <NavLink onClick={close} to="/system/interop">
              Interop
            </NavLink>
          </li>
        </Submenu>
        <li className="menu">
          <NavLink to="/bank-accounts" activeClassName="active" onClick={close}>
            <i className="bx bxs-bank"></i>
            <span>Bank Accounts</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

const Submenu = ({ children, label, icon }) => {
  const [active, setActive] = useState(false);
  function toggleActive(e) {
    e.preventDefault();
    setActive(!active);
  }
  return (
    <li className={classNames('submenu-toggle', { active: active })}>
      <a href="#toggleActive" onClick={toggleActive}>
        <i className={classNames('bx', icon)}></i>
        <span>{label}</span>
      </a>
      <ul className="submenu">{children}</ul>
    </li>
  );
};

export default Sidebar;
