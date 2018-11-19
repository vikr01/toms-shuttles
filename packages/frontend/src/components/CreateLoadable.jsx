// @flow
import React from 'react';
import Loadable from 'react-loadable';
import type { Node } from 'react';
import { Button } from '@material-ui/core';

type LoadingProps = {
  error: boolean,
  retry: Function,
};

const defaultLoading = ({ error, retry }: LoadingProps): Node => {
  if (error) {
    return (
      <div>
        Error!
        <Button onClick={retry}>Retry</Button>
      </div>
    );
  }
  return <div>Loading...</div>;
};

type Props = {
  loader: Node,
  children: ?Node,
};

const CreateLoadable = ({
  loader,
  children: loading = defaultLoading,
  ...otherProps
}: Props): Node => {
  const LoadableComponent = Loadable({
    loader,
    loading,
    ...otherProps,
  });

  return <LoadableComponent />;
};

export default CreateLoadable;
