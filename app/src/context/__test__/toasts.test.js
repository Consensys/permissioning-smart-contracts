// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import { ToastProvider } from "../toasts";

describe("<ToastProvider />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <ToastProvider>
                <div className="test" />
            </ToastProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
