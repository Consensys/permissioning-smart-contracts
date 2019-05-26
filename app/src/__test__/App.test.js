// Libs
import React from "react";
import { shallow } from "enzyme";
import toJson from "enzyme-to-json";
// Components
import App from "../App";

describe("<App />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
