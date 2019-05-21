// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { mount } from "enzyme";
// Components
import Dashboard from "../Dashboard";
import TabSelector from "../TabSelector";
import LoadingPage from "../../LoadingPage/LoadingPage";
// Constants
import { ADMIN_TAB, ENODE_TAB } from "../../../constants/tabs";

describe("<Dashboard />", () => {
    let wrapper;

    describe("data not ready", () => {
        beforeEach(() => {
            wrapper = mount(
                <Dashboard
                    dataReady={false}
                    tab={ADMIN_TAB}
                    setTab={console.log}
                />
            );
        });

        it("has props dataReady=true", () => {
            expect(wrapper.props().dataReady).toEqual(false);
        });

        it("renders LoadingPage", () => {
            expect(wrapper.contains(<LoadingPage />)).toEqual(true);
        });

        it("renders TabSelector", () => {
            expect(
                wrapper.contains(
                    <TabSelector tab={ADMIN_TAB} setTab={console.log} />
                )
            ).toEqual(true);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("data ready", () => {
        describe("tab=ADMIN_TAB", () => {
            beforeEach(() => {
                wrapper = mount(
                    <Dashboard
                        dataReady={true}
                        tab={ADMIN_TAB}
                        setTab={console.log}
                    />
                );
            });

            it("has props dataReady=true", () => {
                expect(wrapper.props().dataReady).toEqual(true);
            });

            it("has props tab=ADMIN_TAB", () => {
                expect(wrapper.props().tab).toEqual(ADMIN_TAB);
            });

            it("has props setTab=console.log", () => {
                expect(wrapper.props().setTab).toEqual(console.log);
            });

            it("renders TabSelector", () => {
                expect(
                    wrapper.contains(
                        <TabSelector tab={ADMIN_TAB} setTab={console.log} />
                    )
                ).toEqual(true);
            });

            it('renders <div className="adminTable" />', () => {
                expect(
                    wrapper.contains(<div className="adminTable" />)
                ).toEqual(true);
            });

            it("matches snapshot", () => {
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });

        describe("tab=ENODE_TAB", () => {
            beforeEach(() => {
                wrapper = mount(
                    <Dashboard
                        dataReady={true}
                        tab={ENODE_TAB}
                        setTab={console.log}
                    />
                );
            });

            it("has props dataReady=true", () => {
                expect(wrapper.props().dataReady).toEqual(true);
            });

            it("has props tab=ADMIN_TAB", () => {
                expect(wrapper.props().tab).toEqual(ENODE_TAB);
            });

            it("has props setTab=console.log", () => {
                expect(wrapper.props().setTab).toEqual(console.log);
            });

            it("renders TabSelector", () => {
                expect(
                    wrapper.contains(
                        <TabSelector tab={ENODE_TAB} setTab={console.log} />
                    )
                ).toEqual(true);
            });

            it('renders <div className="enodeTable" />', () => {
                expect(
                    wrapper.contains(<div className="enodeTable" />)
                ).toEqual(true);
            });

            it("matches snapshot", () => {
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });
});
