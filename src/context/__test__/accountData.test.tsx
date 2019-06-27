// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow, ShallowWrapper } from "enzyme";
// Components
import { AccountDataProvider } from "../accountData";

describe("<AccountDataProvider />", () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(
            <AccountDataProvider>
                <div className="test" />
            </AccountDataProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
