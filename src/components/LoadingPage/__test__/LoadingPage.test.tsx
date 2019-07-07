// Libs
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import LoadingPage from '../LoadingPage';

describe('<LoadingPage />', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(<LoadingPage />);
  });

  it('matches snapshot', () => {
    expect(toJson(wrapper)).toMatchSnapshot();
  });
});
