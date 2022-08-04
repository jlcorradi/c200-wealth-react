import classnames from 'classnames';
import React from 'react';

const TabSet = ({children, className}) => {
  const [activeTab, setActiveTab] = React.useState(children[0].props.label);

  return (
    <div className={classnames('tabs margin-v box', className, {})}>
      <ul>
        {children.map((child, idx) => (
          <li
            className={classnames('tab-link', {active: child.props.label === activeTab})}
            key={idx}
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(child.props.label);
            }}>
            <span>{child.props.label}</span>
          </li>
        ))}
      </ul>

      <div className="tab-panel">
        {children.map((child, idx) => {
          if (child.props.label === activeTab) {
            return child.props.children;
          }
          return null;
        })}
      </div>
    </div>
  );
};

export const TabSheet = ({label, onShow, onHide, children}) => {
  return {children};
};

export default TabSet;
