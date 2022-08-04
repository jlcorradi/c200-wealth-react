import React from 'react';

function LoadingComponent({ loadingMessage }) {
  return (
    <div
      className="empty-container flex flex-column flex-1 justify-content-center align-items-center"
      style={{ width: '100%', height: '200%' }}
    >
      <h6 className="padding margin">
        {loadingMessage ? loadingMessage + '...' : 'Loading...'}
      </h6>
      <i className="bx bx-circle bx-burst"></i>
    </div>
  );
}

export default LoadingComponent;
