import React from 'react';
import EmptyPlaceHolder from '../template/EmptyPlaceHolder';
import LoadingComponent from '../template/LoadingComponent';

function LoaderAndEmptyWrapper({
  isLoading,
  isEmpty,
  emptyLable,
  emptyIcon,
  children,
  loadingMessage
}) {
  if (isLoading) {
    return <LoadingComponent loadingMessage={loadingMessage} />;
  }

  if (!isLoading && isEmpty) {
    return (
      <EmptyPlaceHolder
        label={emptyLable || 'Nothing to show.'}
        icon={emptyIcon || 'bx-confused'}
      />
    );
  }

  return children;
}

export default LoaderAndEmptyWrapper;
