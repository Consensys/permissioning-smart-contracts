// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import DashboardContainer from "../Dashboard";
// Context
import { useData } from "../../../context/data";

jest.mock("../../../context/data", () => {
    return {
        useData: jest.fn()
    };
});

describe("<Dashboard Container />", () => {
    let wrapper;

    beforeAll(() => {
        useData.mockImplementation(() => ({
            dataReady: true
        }));
    });

    beforeEach(() => {
        jest.clearAllMocks();
        wrapper = shallow(<DashboardContainer />);
    });

    it("has called useData once", () => {
        expect(useData).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
