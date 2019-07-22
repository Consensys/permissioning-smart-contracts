// Libs
import React from 'react';
import { mocked } from 'ts-jest/utils';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import { AdminDataProvider } from '../adminData';
import { useNetwork } from '../network';

jest.mock('../network', () => ({
  useNetwork: jest.fn()
}));

describe('<AdminDataProvider />', () => {
  let wrapper: ShallowWrapper;

  beforeAll(() => {
    mocked(useNetwork).mockImplementation((): any => ({}));
  });

  beforeEach(() => {
    wrapper = shallow(
      <AdminDataProvider>
        <div className="test" />
      </AdminDataProvider>
    );
  });

  it('renders children when passed in', () => {
    expect(wrapper.contains(<div className="test" />)).toEqual(true);
  });
});
