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

    describe("general", () => {
        beforeEach(() => {
            wrapper = mount(<TabSelector tab="testTab" setTab={mockSetTab} />);
        });

        it("has props tab='testTab'", () => {
            expect(wrapper.props().tab).toEqual("testTab");
        });

        it("has props setTab=mockSetTab", () => {
            expect(wrapper.props().setTab).toEqual(mockSetTab);
        });

        it("renders tabs.length box of class choiceBox", () => {
            expect(wrapper.find("Box.choiceBox")).toHaveLength(tabs.length);
        });
    });

    describe('tab="unknownTab"', () => {
        beforeEach(() => {
            jest.clearAllMocks();
            wrapper = mount(
                <TabSelector tab="unknownTab" setTab={mockSetTab} />
            );
        });

        it("renders zero box of class selected and choiceBox", () => {
            expect(wrapper.find("Box.selected.choiceBox")).toHaveLength(0);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    tabs.forEach(({ id, text }) => {
        describe(`tab=${id}`, () => {
            beforeEach(() => {
                jest.clearAllMocks();
                wrapper = mount(<TabSelector tab={id} setTab={mockSetTab} />);
            });

            it("renders one box of class selected and choiceBox", () => {
                expect(wrapper.find("Box.selected.choiceBox")).toHaveLength(1);
            });

            it("renders one box of class selected and choiceBox with appropriate text", () => {
                expect(wrapper.find("Box.selected.choiceBox").text()).toEqual(
                    text
                );
            });

            it("matches snapshot", () => {
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });

    describe("simulate click from tabs[1] to tabs[0]", () => {
        beforeAll(() => {
            wrapper = mount(
                <TabSelector tab={tabs[1].id} setTab={mockSetTab} />
            );
        });

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it("renders one box of class selected and choiceBox with appropriate text", () => {
            expect(wrapper.find("Box.selected.choiceBox").text()).toEqual(
                tabs[1].text
            );
        });

        it("calls mockSetTab when clicking on a box", () => {
            const box = wrapper.find("Box.choiceBox:first-child");
            box.simulate("click");
            expect(mockSetTab).toHaveBeenCalledTimes(1);
        });

        it("renders one box of class selected and choiceBox with appropriate text", () => {
            wrapper.setProps({ tab: tabs[0].id });
            expect(wrapper.find("Box.selected.choiceBox").text()).toEqual(
                tabs[0].text
            );
        });
    });
});
