import React, { FC, PropsWithChildren, ReactElement, ReactNode } from "react";
import EmptyPlaceHolder from "../template/EmptyPlaceHolder";
import LoadingComponent from "../template/LoadingComponent";

interface Props {
  isLoading: boolean;
  isEmpty: boolean;
  emptyLabel?: string;
  emptyIcon?: string;
  loadingMessage?: string;
}

export const LoaderAndEmptyWrapper: FC<PropsWithChildren<Props>> = ({
  isLoading,
  isEmpty,
  emptyIcon,
  emptyLabel,
  loadingMessage,
  children,
}) => {
  if (isLoading) {
    return <LoadingComponent loadingMessage={loadingMessage} />;
  }

  if (!isLoading && isEmpty) {
    return (
      <EmptyPlaceHolder
        label={emptyLabel || "Nothing to show."}
        icon={emptyIcon || "bx-confused"}
      />
    );
  }

  return <>{children}</>;
};

export default LoaderAndEmptyWrapper;
