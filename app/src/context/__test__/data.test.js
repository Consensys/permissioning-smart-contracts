// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import { DataProvider } from "../data";

describe("<DataProvider />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <DataProvider>
                <div className="test" />
            </DataProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
