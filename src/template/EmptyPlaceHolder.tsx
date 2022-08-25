import classNames from "classnames";
import React, { FC } from "react";

export const EmptyPlaceHolder: FC<{ label: string; icon: string }> = ({
  label,
  icon,
}) => {
  return (
    <div className="flex-1 empty-container margin flex flex-column justify-content-center align-items-center">
      <span style={{ textAlign: "center" }} className="padding">
        {label}
      </span>
      <i style={{ textAlign: "center" }} className={classNames("bx", icon)}></i>
    </div>
  );
};

export default EmptyPlaceHolder;
