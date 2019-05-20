// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import Dashboard from "../Dashboard";

const mockUseData = jest.fn().mockReturnValue({ dataReady: true });

jest.mock("../../../context/data", () => {
    return {
        useData: () => mockUseData()
    };
});

describe("<Dashboard />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<Dashboard />);
    });

    it("has called useData once", () => {
        expect(mockUseData).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
