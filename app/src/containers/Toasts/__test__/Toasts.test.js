// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { shallow } from "enzyme";
// Components
import ToastsContainer from "../Toasts";
// Context
import { useToast } from "../../../context/toasts";

jest.mock("../../../context/toasts", () => {
    return {
        useToast: jest
            .fn()
            .mockImplementation(() => ({ toasts: [], closeToast: () => {} }))
    };
});

describe("<Toasts Container />", () => {
    let wrapper;

    beforeEach(() => {
        jest.clearAllMocks();
        wrapper = shallow(<ToastsContainer />);
    });

    it("has called useToast once", () => {
        expect(useToast).toHaveBeenCalledTimes(1);
    });

    it("matches snapshot", () => {
        expect(toJson(wrapper)).toMatchSnapshot();
    });
});
