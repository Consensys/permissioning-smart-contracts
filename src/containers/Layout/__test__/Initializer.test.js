// Libs
import React from "react";
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

const NoProvider = () => <div className="noProvider" />;
const WrongNetwork = ({ networkId }) => <div className="wrongNetwork" />;

describe("<Initializer />", () => {
    let wrapper;

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
            <Initializer NoProvider={NoProvider} WrongNetwork={WrongNetwork}>
                <div className="test" />
            </Initializer>
        );
    });

    it("has called useNetwork once", () => {
        expect(useNetwork).toHaveBeenCalledTimes(1);
    });

    it("contains NoProvider={NoProvider} as a props", () => {
        expect(wrapper.props().NoProvider).toEqual(NoProvider);
    });

    it("contains WrongNetwork={WrongNetwork} as a props", () => {
        expect(wrapper.props().WrongNetwork).toEqual(WrongNetwork);
    });

    it('contains children={<div className="test" />} as a props', () => {
        expect(wrapper.props().children).toEqual(<div className="test" />);
    });

    describe("web3Initialized=false", () => {
        beforeAll(() => {
            useNetwork.mockImplementation(() => ({
                web3Initialized: false,
                networkId: undefined,
                isCorrectNetwork: null
            }));
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
            useNetwork.mockImplementation(() => ({
                web3Initialized: true,
                networkId: undefined,
                isCorrectNetwork: null
            }));
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
            useNetwork.mockImplementation(() => ({
                web3Initialized: true,
                networkId: 0,
                isCorrectNetwork: false
            }));
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
            useNetwork.mockImplementation(() => ({
                web3Initialized: true,
                networkId: 0,
                isCorrectNetwork: true
            }));
        });

        it("render children when passed in", () => {
            expect(wrapper.contains(<div className="test" />)).toEqual(true);
        });

        it("matches snapshot", () => {
            expect(toJson(wrapper)).toMatchSnapshot();
        });
    });
});
