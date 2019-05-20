// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { mount } from "enzyme";
// Components
import Dashboard from "../Dashboard";
import LoadingPage from "../../LoadingPage/LoadingPage";

describe("<Dashboard />", () => {
    let wrapper;

    describe("data not ready", () => {
        beforeEach(() => {
            wrapper = mount(<Dashboard dataReady={false} />);
        });

        it("has props dataReady=true", () => {
            expect(wrapper.props().dataReady).toEqual(false);
        });

        it("renders LoadingPage", () => {
            expect(wrapper.contains(<LoadingPage />)).toEqual(true);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("data ready", () => {
        beforeEach(() => {
            wrapper = mount(<Dashboard dataReady={true} />);
        });

        it("has props dataReady=true", () => {
            expect(wrapper.props().dataReady).toEqual(true);
        });

        it("renders LoadingPage", () => {
            expect(wrapper.contains(<div>Ready</div>)).toEqual(true);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
