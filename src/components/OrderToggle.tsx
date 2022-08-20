import classNames from "classnames";
import React, { FC } from "react";

export const OrderToggle: FC<{
  field: string;
  order: string;
  description: string;
  onChange: (value: string) => void;
}> = ({ field, order, description, onChange }) => {
  function getIsDescending() {
    const re = /(.*)\((.*)\)/;
    let array = re.exec(order);
    return array ? array[2].toUpperCase() === "DESC" : "ASC";
  }

  function changeOrder() {
    let descending = !getIsDescending();
    let newOrder = `${field}(${descending ? "DESC" : "ASC"})`;
    onChange(newOrder);
  }

  return (
    <span
      className={classNames("order-toggle", {
        active: order.includes(field),
        descending: getIsDescending(),
      })}
      onClick={(e) => changeOrder()}
    >
      <span>{description}</span>
    </span>
  );
};
