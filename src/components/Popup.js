import classNames from 'classnames';
import React from 'react';

function Popup({visible, children, left, onClose}) {
  return <div className={classNames('popup shadow text-left', {active: visible, 'popup-left': left})}>
      <div>{children}</div>
  </div>;
}

export default Popup;
