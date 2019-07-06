// Libs
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import NoProvider from '../NoProvider';

describe('<NoProvider />', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<NoProvider />);
  });

  it('matches snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
