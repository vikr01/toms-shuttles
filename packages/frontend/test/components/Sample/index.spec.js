import React from 'react';
import renderer from 'react-test-renderer';

describe('Sample component', () => {
  test('should match exact Sample snapshot', async () => {
    const {
      default: Sample,
    } = await import('toms-shuttles-frontend/src/components/Sample');
    const sample = <Sample />;

    const tree = renderer.create(sample);

    expect(tree.toJSON()).toMatchSnapshot();
  });
});
