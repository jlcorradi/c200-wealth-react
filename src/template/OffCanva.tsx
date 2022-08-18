import classNames from "classnames";
import React, { ReactNode } from "react";

export const OffCanva: React.FC<{
  onDismiss: () => void;
  visible: Boolean;
  children: ReactNode;
  tittle?: string;
}> = ({ onDismiss, visible, children, tittle }) => {
  return (
    <div
      className={classNames("offcanva", "shadow", "border-left", {
        visible: visible,
      })}
    >
      {tittle ? <h3>{tittle}</h3> : null}
      <div className="offcanva-dissmiss" onClick={onDismiss}>
        <i className="bx bx-x"></i>
      </div>
      {tittle ? <div className="border-bottom padding-v"></div> : null}
      {children}
    </div>
  );
};

export default OffCanva;
