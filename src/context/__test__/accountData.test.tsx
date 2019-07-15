// Libs
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import { AccountDataProvider } from '../accountData';
import { useNetwork } from '../network';

jest.mock('../network', () => ({
  useNetwork: jest.fn()
}));

describe('<AccountDataProvider />', () => {
  let wrapper: ShallowWrapper;

  beforeAll(() => {
    mocked(useNetwork).mockImplementation((): any => ({}));
  });

  beforeEach(() => {
    wrapper = shallow(
      <AccountDataProvider>
        <div className="test" />
      </AccountDataProvider>
    );
  });

  it('renders children when passed in', () => {
    expect(wrapper.contains(<div className="test" />)).toEqual(true);
  });
});
