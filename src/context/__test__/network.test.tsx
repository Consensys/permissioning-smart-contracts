// Libs
import React from 'react';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import { NetworkProvider } from '../network';

jest.mock('../configData');

describe('<NetworkProvider />', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <NetworkProvider>
        <div className="test" />
      </NetworkProvider>
    );
  });

  it('renders children when passed in', () => {
    expect(wrapper.contains(<div className="test" />)).toEqual(true);
  });
});
