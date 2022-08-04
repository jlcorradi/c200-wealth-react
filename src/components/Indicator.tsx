import classNames from "classnames";
import React from "react";

export const Indicator: React.FC<{
  label: string;
  value: string;
  icon?: string;
  color?: string;
}> = ({ label, value, icon, color }) => {
  return (
    <div
      className={classNames(
        "indicator",
        "border-right",
        "border-bottom",
        "flex,",
        "flex-column",
        "padding",
        "flex-1",
        color
      )}
    >
      <h3 className="thin">{label}</h3>
      <div className="flex flex-row flex-1 align-items-center justify-content-space-between padding">
        <span className="flex flex-column align-items-center justify-content center">
          <i className={classNames("bx", icon || "bx-info-circle")}></i>
        </span>
        <h1 className="padding text-right">{value}</h1>
      </div>
    </div>
  );
};
