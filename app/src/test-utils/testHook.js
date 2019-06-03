import React from "react";
import { mount } from "enzyme";

const TestHook = ({ callback }) => {
    callback();
    return null;
};

export const testHook = (callback, Provider, value) => {
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
