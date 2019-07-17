// Libs
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import { NodeDataProvider } from '../nodeData';
import { useNetwork } from '../network';

jest.mock('../network', () => ({
  useNetwork: jest.fn()
}));

describe('<NodeDataProvider />', () => {
  let wrapper: ShallowWrapper;

  beforeAll(() => {
    mocked(useNetwork).mockImplementation((): any => ({}));
  });

  beforeEach(() => {
    wrapper = shallow(
      <NodeDataProvider>
        <div className="test" />
      </NodeDataProvider>
    );
  });

  it('renders children when passed in', () => {
    expect(wrapper.contains(<div className="test" />)).toEqual(true);
  });
});
