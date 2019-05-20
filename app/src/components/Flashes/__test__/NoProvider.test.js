// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import NoProvider from "../NoProvider";

describe("<NoProvider />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<NoProvider />);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
