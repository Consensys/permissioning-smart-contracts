// Libs
import React, { useState } from "react";
import toJson from "enzyme-to-json";
import { mount } from "enzyme";
// Components
import Dashboard from "../Dashboard";
// Constant
import { ADMIN_TAB } from "../../../constants/tabs";

const mockUseData = jest.fn().mockReturnValue({ dataReady: true });

jest.mock("../../../context/data", () => {
    return {
        useData: () => mockUseData()
    };
});

describe("<Dashboard />", () => {
    let wrapper;

    beforeEach(() => {
        jest.clearAllMocks();
        wrapper = mount(<Dashboard hook={() => useState(ADMIN_TAB)} />);
    });

    it("has called useData once", () => {
        expect(mockUseData).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
