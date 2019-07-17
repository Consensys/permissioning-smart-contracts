// Libs
import React from 'react';
import { mocked } from 'ts-jest/utils';
import toJson from 'enzyme-to-json';
import { mount, ReactWrapper } from 'enzyme';
// Components
import Dashboard from '../Dashboard';
import TabSelector from '../TabSelector';
import AdminTab from '../../../containers/Tabs/Admin';
import EnodeTab from '../../../containers/Tabs/Enode';
import Toasts from '../../../containers/Toasts/Toasts';
import { ToastProvider } from '../../../context/toasts';
// Constants
import { ADMIN_TAB, ENODE_TAB } from '../../../constants/tabs';
// Context
import { useAccountData, AccountDataProvider } from '../../../context/accountData';
import { useAdminData, AdminDataProvider } from '../../../context/adminData';
import { useNodeData, NodeDataProvider } from '../../../context/nodeData';

jest.mock('../../../context/accountData', () => {
  return {
    useAccountData: jest.fn(),
    AccountDataProvider: jest.fn()
  };
});

jest.mock('../../../context/adminData', () => {
  return {
    useAdminData: jest.fn(),
    AdminDataProvider: jest.fn()
  };
});

jest.mock('../../../context/nodeData', () => {
  return {
    useNodeData: jest.fn(),
    NodeDataProvider: jest.fn()
  };
});

jest.mock('../../../containers/Tabs/useTab', () => {
  return jest.fn().mockImplementation(() => ({
    list: [],
    toasts: [],
    modals: { add: false, remove: false, lock: false },
    toggleModal: () => () => {},
    closeModal: () => {},
    deleteTransaction: () => {},
    transactions: new Map()
  }));
});

jest.mock('drizzle-react', () => {
  return {
    drizzleReactHooks: {
      useDrizzle: jest.fn().mockImplementation(() => ({
        drizzle: {
          contracts: {
            Admin: {
              methods: {
                addAdmin: () => {},
                removeAdmin: () => {}
              }
            },
            NodeRules: {
              methods: {
                enterReadOnly: () => {},
                exitReadOnly: () => {}
              }
            },
            AccountRules: {
              methods: {}
            }
          }
        }
      })),
      useDrizzleState: jest.fn()
    }
  };
});

describe('<Dashboard />', () => {
  let wrapper: ReactWrapper<any, any, any>;

  describe('Dashboard ready', () => {
    beforeAll(() => {
      jest.clearAllMocks();
      mocked(useAccountData).mockImplementation(() => ({
        dataReady: true,
        whitelist: [],
        isReadOnly: true,
        accountRulesContract: undefined
      }));
      mocked(AccountDataProvider).mockImplementation(({ children }: any) => <div>{children}</div>);

      mocked(useAdminData).mockImplementation(() => ({
        dataReady: true,
        userAddress: 'test',
        isAdmin: true,
        admins: []
      }));
      mocked(AdminDataProvider).mockImplementation(({ children }: any) => <div>{children}</div>);

      mocked(useNodeData).mockImplementation(() => ({
        userAddress: 'test',
        dataReady: true,
        whitelist: [],
        isReadOnly: true
      }));
      mocked(NodeDataProvider).mockImplementation(({ children }: any) => <div>{children}</div>);
    });
    describe('tab=ADMIN_TAB', () => {
      beforeEach(() => {
        wrapper = mount(<Dashboard tab={ADMIN_TAB} setTab={console.log} />);
      });
      it('has props tab=ADMIN_TAB', () => {
        expect(wrapper.props().tab).toEqual(ADMIN_TAB);
      });

      it('has props setTab=console.log', () => {
        expect(wrapper.props().setTab).toEqual(console.log);
      });

      it('renders TabSelector', () => {
        expect(wrapper.contains(<TabSelector tab={ADMIN_TAB} setTab={console.log} />)).toEqual(true);
      });

      it('renders Toasts', () => {
        expect(wrapper.contains(<Toasts />)).toEqual(true);
      });

      it('renders AdminTab with isOpen=true', () => {
        expect(wrapper.contains(<AdminTab isOpen={true} />)).toEqual(true);
      });

      it('renders EnodeTab with isOpen=false', () => {
        expect(wrapper.contains(<EnodeTab isOpen={false} />)).toEqual(true);
      });

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });

    describe('tab=ENODE_TAB', () => {
      beforeEach(() => {
        wrapper = mount(<Dashboard tab={ENODE_TAB} setTab={console.log} />);
      });

      it('has props tab=ADMIN_TAB', () => {
        expect(wrapper.props().tab).toEqual(ENODE_TAB);
      });

      it('has props setTab=console.log', () => {
        expect(wrapper.props().setTab).toEqual(console.log);
      });

      it('renders ToastProvider', () => {
        expect(wrapper.find(ToastProvider)).toHaveLength(1);
      });

      it('renders TabSelector', () => {
        expect(wrapper.contains(<TabSelector tab={ENODE_TAB} setTab={console.log} />)).toEqual(true);
      });

      it('renders Toasts', () => {
        expect(wrapper.contains(<Toasts />)).toEqual(true);
      });

      it('renders AdminTab with isOpen=false', () => {
        expect(wrapper.contains(<AdminTab isOpen={false} />)).toEqual(true);
      });

      it('renders EnodeTab with isOpen=true', () => {
        expect(wrapper.contains(<EnodeTab isOpen={true} />)).toEqual(true);
      });

      it('matches snapshot', () => {
        expect(toJson(wrapper)).toMatchSnapshot();
      });
    });
  });
});
