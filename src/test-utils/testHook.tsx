import React from 'react';
import { mount } from 'enzyme';

const TestHook = ({ callback }: { callback: () => void }) => {
  callback();
  return null;
};

export const testHook = (callback: () => void, Provider: React.FC<any>, value?: any) => {
  if (Provider) {
    if (value) {
      mount(
        <Provider value={value}>
          <TestHook callback={callback} />
        </Provider>
      );
    } else {
      mount(
        <Provider>
          <TestHook callback={callback} />
        </Provider>
      );
    }
  } else {
    mount(<TestHook callback={callback} />);
  }
};
