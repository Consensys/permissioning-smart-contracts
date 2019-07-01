// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow, ShallowWrapper } from "enzyme";
// Components
import Layout from "../Layout";
import AppBar from "../../AppBar/AppBar";

describe("<Layout />", () => {
    let wrapper: ShallowWrapper;

    beforeEach(() => {
        wrapper = shallow(
            <Layout>
                <div className="test" />
            </Layout>
        );
    });

    it("contains a AppBar element", () => {
        expect(wrapper.find(AppBar)).toHaveLength(1);
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
