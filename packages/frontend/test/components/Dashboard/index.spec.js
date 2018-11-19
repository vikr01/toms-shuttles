import React from 'react';
import renderer from 'react-test-renderer';
import Dashboard from 'tbd-frontend-name/src/components/Dashboard';

describe('Dashboard', () => {
  test('snapshot matches', () => {
    const dashboard = <Dashboard />;
    const tree = renderer.create(dashboard);
    expect(tree.toJSON()).toMatchSnapshot();
  });
});
