// @flow
import React from 'react';
import Loadable from 'react-loadable';
import type { Node, ComponentType } from 'react';

export type EsModuleType = {
  default: ComponentType<*>,
};

type Props = {
  loader: () => Promise<EsModuleType>,
  children?: ComponentType<*>,
};

const defaultLoading = (): Node => <div>Loading...</div>;

const CreateLoadable = ({ loader, children }: Props): Node => {
  const LoadableComponent = Loadable({
    loader,
    loading: children,
  });

  return <LoadableComponent />;
};

CreateLoadable.defaultProps = {
  children: defaultLoading,
};

export default CreateLoadable;
