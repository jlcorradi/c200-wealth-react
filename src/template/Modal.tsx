import React, { FC, PropsWithChildren } from "react";

export const Modal: FC<
  PropsWithChildren<{ visible: boolean; title: string; onClose: () => void }>
> = ({ children, visible, title, onClose }) => {
  if (!visible) {
    return <></>;
  }
  return (
    <div className="modal">
      <div className="modalContent">
        <div className="box shadow padding flex flex-column">
          <div className="padding flex flex-row border-bottom margin-bottom">
            <h3>{title}</h3>

            <div className="offcanva-dissmiss" onClick={onClose}>
              <i className="bx bx-x"></i>
            </div>
          </div>
          <div className="padding">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
