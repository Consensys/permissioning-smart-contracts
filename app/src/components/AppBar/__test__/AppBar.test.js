// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import AppBar from "../AppBar";

describe("<AppBar />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<AppBar />);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
