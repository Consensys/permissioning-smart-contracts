// Libs
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow, ShallowWrapper } from 'enzyme';
// Components
import { AdminDataProvider } from '../adminData';

describe('<AdminDataProvider />', () => {
  let wrapper: ShallowWrapper;

  beforeEach(() => {
    wrapper = shallow(
      <AdminDataProvider>
        <div className="test" />
      </AdminDataProvider>
    );
  });
});
