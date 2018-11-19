import React from 'react';
import renderer from 'react-test-renderer';
import delay from 'delay';
import CreateLoadable from 'tbd-frontend-name/src/components/CreateLoadable';

describe('CreateLoadable', () => {
  test('works with a simple component', async () => {
    const createdLoadable = (
      <CreateLoadable loader={async () => () => <div>Foo</div>} />
    );
    const tree = renderer.create(createdLoadable);

    expect(tree.toJSON()).toMatchSnapshot();

    await delay(100);

    expect(tree.toJSON()).toMatchSnapshot();
  });

  test('handles errors', async () => {
    const createdLoadable = (
      <CreateLoadable
        loader={async () => {
          throw new Error('foo');
        }}
      />
    );

    const tree = renderer.create(createdLoadable);

    expect(tree.toJSON()).toMatchSnapshot();

    await delay(100);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
