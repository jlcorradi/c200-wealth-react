import classNames from "classnames";
import React, { FC } from "react";

export const LoadMoreButton: FC<{ enabled: boolean; onClick: () => void }> = ({
  enabled,
  onClick,
}) => {
  return (
    <div className="padding flex flex-row align-items-center justify-content-center">
      {/* <span>Showing {enabled} Items</span> */}
      <span className={classNames("padding", { disabled: !enabled })}>
        <button disabled={!enabled} onClick={onClick}>
          <i className="bx bx-loader-alt"></i>
          <span>Load More</span>
        </button>
      </span>
    </div>
  );
};

export default LoadMoreButton;
