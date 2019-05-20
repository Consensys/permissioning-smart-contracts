// Libs
import React, { memo } from "react";
import toJson from "enzyme-to-json";
import { mount } from "enzyme";
// Components
import Initializer from "../Initializer";

import { useNetwork } from "../../../context/network";

jest.mock("../../../context/network", () => {
    return {
        useNetwork: jest.fn()
    };
});

const NoProvider = memo(() => <div className="noProvider" />);
const WrongNetwork = memo(({ networkId }) => <div className="wrongNetwork" />);

describe("<Initializer />", () => {
    let wrapper;

    describe("web3Initialized=false", () => {
        beforeAll(() => {
            useNetwork.mockImplementation(() => ({
                web3Initialized: false,
                networkId: undefined,
                isCorrectNetwork: null
            }));
        });

        beforeEach(() => {
            jest.clearAllMocks();

            wrapper = mount(
                <Initializer
                    NoProvider={NoProvider}
                    WrongNetwork={WrongNetwork}
                >
                    <div className="test" />
                </Initializer>
            );
        });

        it("does not render children when passed in", () => {
            expect(wrapper.contains(<div className="test" />)).toEqual(false);
        });

        it("contains no children", () => {
            expect(wrapper.children()).toHaveLength(0);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("web3Initialized=true, networkId=undefined", () => {
        beforeAll(() => {
            jest.restoreAllMocks();

            useNetwork.mockImplementation(() => ({
                web3Initialized: true,
                networkId: undefined,
                isCorrectNetwork: null
            }));
        });

        beforeEach(() => {
            jest.clearAllMocks();

            wrapper = mount(
                <Initializer
                    NoProvider={NoProvider}
                    WrongNetwork={WrongNetwork}
                >
                    <div className="test" />
                </Initializer>
            );
        });

        it("has called useNetwork once", () => {
            expect(useNetwork).toHaveBeenCalledTimes(1);
        });

        it("does not render children when passed in", () => {
            expect(wrapper.contains(<div className="test" />)).toEqual(false);
        });

        it("contains one children", () => {
            expect(wrapper.children()).toHaveLength(1);
        });

        it("contains NoProvider", () => {
            expect(wrapper.contains(<NoProvider />)).toEqual(true);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("web3Initialized=true, networkId=0, isCorrectNetwork=false", () => {
        beforeAll(() => {
            jest.restoreAllMocks();

            useNetwork.mockImplementation(() => ({
                web3Initialized: true,
                networkId: 0,
                isCorrectNetwork: false
            }));
        });

        beforeEach(() => {
            jest.clearAllMocks();

            wrapper = mount(
                <Initializer
                    NoProvider={NoProvider}
                    WrongNetwork={WrongNetwork}
                >
                    <div className="test" />
                </Initializer>
            );
        });

        it("has called useNetwork once", () => {
            expect(useNetwork).toHaveBeenCalledTimes(1);
        });

        it("does not render children when passed in", () => {
            expect(wrapper.contains(<div className="test" />)).toEqual(false);
        });

        it("contains one children", () => {
            expect(wrapper.children()).toHaveLength(1);
        });

        it("contains NoProvider", () => {
            expect(wrapper.contains(<WrongNetwork networkId={0} />)).toEqual(
                true
            );
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });

    describe("web3Initialized=true, networkId=0, isCorrectNetwork=true", () => {
        beforeAll(() => {
            jest.restoreAllMocks();

            useNetwork.mockImplementation(() => ({
                web3Initialized: true,
                networkId: 0,
                isCorrectNetwork: true
            }));
        });

        beforeEach(() => {
            jest.clearAllMocks();

            wrapper = mount(
                <Initializer
                    NoProvider={NoProvider}
                    WrongNetwork={WrongNetwork}
                >
                    <div className="test" />
                </Initializer>
            );
        });

        it("has called useNetwork once", () => {
            expect(useNetwork).toHaveBeenCalledTimes(1);
        });

        it("render children when passed in", () => {
            expect(wrapper.contains(<div className="test" />)).toEqual(true);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
