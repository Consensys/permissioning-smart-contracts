// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow, ShallowWrapper } from "enzyme";
// Components
import { ConfigDataProvider } from "../configData";

describe("<NodeDataProvider />", () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(
            <ConfigDataProvider config={{}}>
                <div className="test" />
            </ConfigDataProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });
});
