// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { mount } from "enzyme";
// Components
import TabSelector from "../TabSelector";
// Constants
import tabs, { ADMIN_TAB, ENODE_TAB } from "../../../constants/tabs";

const mockSetTab = jest.fn();

describe("<TabSelector />", () => {
    let wrapper;

    describe('tab="unknownTab"', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            wrapper = mount(
                <TabSelector tab="unknownTab" setTab={mockSetTab} />
            );
        });

        it("has props tab='unknownTab'", () => {
            expect(wrapper.props().tab).toEqual("unknownTab");
        });

        it("has props setTab=mockSetTab", () => {
            expect(wrapper.props().setTab).toEqual(mockSetTab);
        });

        it("calls mockSetTab when clicking on a box", () => {
            const box = wrapper.find("Box.choiceBox:first-child");
            box.simulate("click");
            expect(mockSetTab).toHaveBeenCalledTimes(1);
        });

        it("renders tabs.length box of class choiceBox", () => {
            expect(wrapper.find("Box.choiceBox")).toHaveLength(tabs.length);
        });

        it("renders zero box of class selected and choiceBox", () => {
            expect(wrapper.find("Box.selected.choiceBox")).toHaveLength(0);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("tab=ADMIN_TAB", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            wrapper = mount(
                <TabSelector tab={ADMIN_TAB} setTab={mockSetTab} />
            );
        });

        it("has props tab=ADMIN_TAB", () => {
            expect(wrapper.props().tab).toEqual(ADMIN_TAB);
        });

        it("has props setTab=mockSetTab", () => {
            expect(wrapper.props().setTab).toEqual(mockSetTab);
        });

        it("renders tabs.length box of class choiceBox", () => {
            expect(wrapper.find("Box.choiceBox")).toHaveLength(tabs.length);
        });

        it("calls mockSetTab when clicking on a box", () => {
            const box = wrapper.find("Box.choiceBox:first-child");
            box.simulate("click");
            expect(mockSetTab).toHaveBeenCalledTimes(1);
        });

        it("renders one box of class selected and choiceBox", () => {
            expect(wrapper.find("Box.selected.choiceBox")).toHaveLength(1);
        });

        it("renders one box of class selected and choiceBox with appropriate text", () => {
            expect(wrapper.find("Box.selected.choiceBox").text()).toEqual(
                tabs[0].text
            );
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("tab=ENODE_TAB", () => {
        beforeEach(() => {
            jest.clearAllMocks();
            wrapper = mount(
                <TabSelector tab={ENODE_TAB} setTab={mockSetTab} />
            );
        });

        it("has props tab=ENODE_TAB", () => {
            expect(wrapper.props().tab).toEqual(ENODE_TAB);
        });

        it("has props setTab=mockSetTab", () => {
            expect(wrapper.props().setTab).toEqual(mockSetTab);
        });

        it("calls mockSetTab when clicking on a box", () => {
            const box = wrapper.find("Box.choiceBox:first-child");
            box.simulate("click");
            expect(mockSetTab).toHaveBeenCalledTimes(1);
        });

        it("renders tabs.length box of class choiceBox", () => {
            expect(wrapper.find("Box.choiceBox")).toHaveLength(tabs.length);
        });

        it("renders one box of class selected and choiceBox", () => {
            expect(wrapper.find("Box.selected.choiceBox")).toHaveLength(1);
        });

        it("renders one box of class selected and choiceBox with appropriate text", () => {
            expect(wrapper.find("Box.selected.choiceBox").text()).toEqual(
                tabs[1].text
            );
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
