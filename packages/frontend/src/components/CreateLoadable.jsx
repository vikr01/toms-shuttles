// @flow
import React from 'react';
import Loadable from 'react-loadable';
import type { Node } from 'react';

type Props = {
  loader: Node,
  children: ?Node,
};

const defaultLoading = (): Node => <div>Loading...</div>;

const CreateLoadable = ({
  loader,
  children: loading = defaultLoading,
}: Props): Node => {
  const LoadableComponent = Loadable({
    loader,
    loading,
  });

  return <LoadableComponent />;
};

export default CreateLoadable;
