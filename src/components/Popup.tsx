import classNames from "classnames";
import React, { FC, ReactNode } from "react";

export const Popup: FC<{
  visible: Boolean;
  children: ReactNode;
  left?: Boolean;
  onClose?: () => void;
}> = ({ visible, children, left = false, onClose }) => {
  return (
    <div
      className={classNames("popup shadow text-left", {
        active: visible,
        "popup-left": left,
      })}
    >
      <div>{children}</div>
    </div>
  );
};
