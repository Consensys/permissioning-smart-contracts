// Libs
import React from 'react';
import { mocked } from 'ts-jest/utils';
import toJson from 'enzyme-to-json';
import { mount, ReactWrapper } from 'enzyme';
// Components
import Initializer from '../Initializer';

import { useNetwork } from '../../../context/network';

jest.mock('../../../context/network', () => {
  return {
    useNetwork: jest.fn()
  };
});

const NoProvider = () => <div className="noProvider" />;
const WrongNetwork = (p: { networkId: number }) => <div className="wrongNetwork" />;

describe('<Initializer />', () => {
  let wrapper: ReactWrapper<any, any, any>;

  beforeAll(() => {
    mocked(useNetwork).mockImplementation(
      () =>
        ({
          networkId: undefined,
          isCorrectNetwork: null
        } as any)
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();

    wrapper = mount(
      <Initializer NoProvider={NoProvider} WrongNetwork={WrongNetwork}>
        <div className="test" />
      </Initializer>
    );
  });

  it('has called useNetwork once', () => {
    expect(useNetwork).toHaveBeenCalledTimes(1);
  });

  it('contains NoProvider={NoProvider} as a props', () => {
    expect(wrapper.props().NoProvider).toEqual(NoProvider);
  });

  it('contains WrongNetwork={WrongNetwork} as a props', () => {
    expect(wrapper.props().WrongNetwork).toEqual(WrongNetwork);
  });

  it('contains children={<div className="test" />} as a props', () => {
    expect(wrapper.props().children).toEqual(<div className="test" />);
  });

  describe('isCorrectNetwork=true, networkId=undefined', () => {
    beforeAll(() => {
      mocked(useNetwork).mockImplementation(
        () =>
          ({
            networkId: undefined,
            isCorrectNetwork: undefined
          } as any)
      );
    });

    it('does not render children when passed in', () => {
      expect(wrapper.contains(<div className="test" />)).toEqual(false);
    });

    it('contains one children', () => {
      expect(wrapper.children()).toHaveLength(1);
    });

    it('contains NoProvider', () => {
      expect(wrapper.contains(<NoProvider />)).toEqual(true);
    });

    it('matches snapshot', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('networkId=0, isCorrectNetwork=false', () => {
    beforeAll(() => {
      mocked(useNetwork).mockImplementation(
        () =>
          ({
            networkId: 0,
            isCorrectNetwork: false
          } as any)
      );
    });

    it('does not render children when passed in', () => {
      expect(wrapper.contains(<div className="test" />)).toEqual(false);
    });

    it('contains one children', () => {
      expect(wrapper.children()).toHaveLength(1);
    });

    it('contains NoProvider', () => {
      expect(wrapper.contains(<WrongNetwork networkId={0} />)).toEqual(true);
    });

    it('matches snapshot', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });

  describe('networkId=0, isCorrectNetwork=true', () => {
    beforeAll(() => {
      mocked(useNetwork).mockImplementation(
        () =>
          ({
            networkId: 0,
            isCorrectNetwork: true
          } as any)
      );
    });

    it('render children when passed in', () => {
      expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it('matches snapshot', () => {
      expect(toJson(wrapper)).toMatchSnapshot();
    });
  });
});
