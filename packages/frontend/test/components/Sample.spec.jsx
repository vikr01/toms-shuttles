import React from 'react';
import renderer from 'react-test-renderer';
import Sample from '../../src/components/Sample';

describe('Sample component', () => {
  test('should match exact Sample snapshot', () => {
    const sample = <Sample />;

    const tree = renderer.create(sample).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
