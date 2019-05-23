// Libs
import React from "react";
import toJson from "enzyme-to-json";
import { mount, shallow } from "enzyme";
import { drizzleReactHooks } from "drizzle-react";
// Components
import Dashboard from "../Dashboard";
import TabSelector from "../TabSelector";
import LoadingPage from "../../LoadingPage/LoadingPage";
import AdminTab from "../../../containers/Tabs/Admin";
import EnodeTab from "../../../containers/Tabs/Enode";
// Constants
import { ADMIN_TAB, ENODE_TAB } from "../../../constants/tabs";
// Context
import { useData } from "../../../context/data";
import useTab from "../../../containers/Tabs/useTab";

jest.mock("../../../context/data", () => {
    return {
        useData: jest.fn()
    };
});

jest.mock("../../../containers/Tabs/useTab", () => {
    return jest.fn();
});

jest.mock("drizzle-react", () => {
    return {
        drizzleReactHooks: {
            useDrizzle: jest.fn().mockImplementation(() => ({
                drizzle: {
                    contracts: {
                        Admin: {
                            methods: {
                                addAdmin: console.log,
                                removeAdmin: console.log
                            }
                        },
                        Rules: {
                            methods: {
                                enterReadOnly: console.log,
                                exitReadOnly: console.log
                            }
                        }
                    }
                }
            }))
        }
    };
});

describe("<Dashboard />", () => {
    let wrapper;

    describe("data not ready", () => {
        beforeAll(() => {
            useData.mockImplementation(() => ({
                dataReady: false,
                admins: []
            }));
            useTab.mockImplementation(() => ({
                list: [],
                toasts: [],
                closeToast: console.log,
                modals: {},
                toggleModal: console.log,
                isAdmin: true,
                deleteTransaction: console.log,
                transactions: new Map()
            }));
        });

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
        beforeAll(() => {
            jest.clearAllMocks();
            useData.mockImplementation(() => ({
                dataReady: true,
                admins: [],
                whitelist: [],
                userAddress: "test",
                isAdmin: true,
                isReadOnly: true
            }));
            useTab.mockImplementation(() => ({
                list: [],
                toasts: [],
                closeToast: console.log,
                modals: {},
                toggleModal: console.log,
                isAdmin: true,
                deleteTransaction: console.log,
                transactions: new Map()
            }));
        });
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

            it("renders AdminTab with isOpen=true", () => {
                expect(wrapper.contains(<AdminTab isOpen={true} />)).toEqual(
                    true
                );
            });

            it("renders EnodeTab with isOpen=false", () => {
                expect(wrapper.contains(<EnodeTab isOpen={false} />)).toEqual(
                    true
                );
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

            it("renders AdminTab with isOpen=false", () => {
                expect(wrapper.contains(<AdminTab isOpen={false} />)).toEqual(
                    true
                );
            });

            it("renders EnodeTab with isOpen=true", () => {
                expect(wrapper.contains(<EnodeTab isOpen={true} />)).toEqual(
                    true
                );
            });

            it("matches snapshot", () => {
                expect(toJson(wrapper)).toMatchSnapshot();
            });
        });
    });
});
