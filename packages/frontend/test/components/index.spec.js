import React from 'react';
import renderer from 'react-test-renderer';
import delay from 'delay';
import Main from 'tbd-frontend-name/src/components';

describe('Overall component', () => {
  test('should match exact snapshot', async () => {
    const main = <Main />;

    const tree = renderer.create(main);

    expect(tree.toJSON()).toMatchSnapshot();

    await delay(100);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
