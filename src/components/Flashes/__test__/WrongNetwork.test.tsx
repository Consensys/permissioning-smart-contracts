// Libs
import React from 'react';
import toJson from 'enzyme-to-json';
import { shallow, mount, ReactWrapper, ShallowWrapper } from 'enzyme';
// Components
import WrongNetwork from '../WrongNetwork';

var errorMessages = [
  () => "Change your network using MetaMask. You're currently on the Main Ethereum Network.",
  () => "Change your network using MetaMask. You're currently on the Morden Classic Test Network.",
  () => "Change your network using MetaMask. You're currently on the Ropsten Test Network.",
  () => "Change your network using MetaMask. You're currently on the Rinkeby Test Network.",
  () => "Change your network using MetaMask. You're currently on the Goerli Test Network.",
  (networkId: number) => `Change your network using MetaMask. You're currently on unknown network of id ${networkId}.`
];

describe('<WrongNetwork />', () => {
  let wrapper: ReactWrapper<any, any, any>;

  beforeEach(() => {
    wrapper = mount(<WrongNetwork networkId={0} />);
  });

  it('contains an element of class wrongNetworkMessage', () => {
    expect(wrapper.find('Text.wrongNetworkMessage')).toHaveLength(1);
  });

  it('has props networkId=0', () => {
    expect(wrapper.props().networkId).toBe(0);
  });

  describe('error message', () => {
    let increment = 1;
    let errorMessage: string;
    let wrongNetworkWrapper: ShallowWrapper;
    beforeEach(() => {
      wrongNetworkWrapper = shallow(<WrongNetwork networkId={increment} />);
      errorMessage = wrongNetworkWrapper.find('.wrongNetworkMessage').text();
    });

    errorMessages.forEach(expectedErrorMessage => {
      it('contains the appropriate text', () => {
        expect(errorMessage).toEqual(expectedErrorMessage(increment));
        increment++;
      });
    });

    it('matches snapshot', () => {
      expect(toJson(wrongNetworkWrapper)).toMatchSnapshot();
    });
  });
});
