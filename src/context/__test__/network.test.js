// Libs
// import React from "../../__mocks__/react";
import React from "react";
// import { act } from 'react-dom/test-utils';
import { shallow } from "enzyme";
import { useNetwork } from "../network";
import { testHook } from "../../test-utils/testHook";
import * as drizzleReact from "drizzle-react";
// Components
import { NetworkProvider } from "../network";

jest.mock("drizzle-react", () => ({
    drizzleReactHooks: {
        ...jest.requireActual("drizzle-react").drizzleReactHooks,
        useDrizzleState: jest.fn()
    }
}));

describe("<NetworkProvider />", () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(
            <NetworkProvider>
                <div className="test" />
            </NetworkProvider>
        );
    });

    it("renders children when passed in", () => {
        expect(wrapper.contains(<div className="test" />)).toEqual(true);
    });
});

describe("useNetwork", () => {
    let network;

    describe('status=""', () => {
        beforeAll(() => {
            drizzleReact.drizzleReactHooks.useDrizzleState.mockImplementation(
                () => ({
                    networkId: undefined,
                    status: ""
                })
            );
            testHook(() => (network = useNetwork()), NetworkProvider);
        });

        it("should have a isCorrectNetwork attribute equal to false", () => {
            expect(network.isCorrectNetwork).toEqual(null);
        });

        it("should have a networkId attribute equal to undefined", () => {
            expect(network.networkId).toEqual(undefined);
        });

        it("should have a web3Initialized attribute equal to false", () => {
            expect(network.web3Initialized).toEqual(false);
        });
    });

    describe('status="initialized"', () => {
        beforeAll(() => {
            drizzleReact.drizzleReactHooks.useDrizzleState.mockImplementation(
                () => ({
                    networkId: undefined,
                    status: "initialized"
                })
            );
            testHook(() => (network = useNetwork()), NetworkProvider);
        });

        it("should have a isCorrectNetwork attribute equal to null", () => {
            expect(network.isCorrectNetwork).toEqual(null);
        });

        it("should have a networkId attribute equal to undefined", () => {
            expect(network.networkId).toEqual(undefined);
        });

        it("should have a web3Initialized attribute equal to true", () => {
            expect(network.web3Initialized).toEqual(true);
        });
    });

    describe('status="initialized" and networkId=0', () => {
        beforeAll(() => {
            drizzleReact.drizzleReactHooks.useDrizzleState.mockImplementation(
                () => ({
                    networkId: 1,
                    status: "initialized"
                })
            );
            testHook(() => (network = useNetwork()), NetworkProvider);
        });

        it("should have a isCorrectNetwork attribute equal to false", () => {
            expect(network.isCorrectNetwork).toEqual(false);
        });

        it("should have a networkId attribute equal to 1", () => {
            expect(network.networkId).toEqual(1);
        });

        it("should have a web3Initialized attribute equal to true", () => {
            expect(network.web3Initialized).toEqual(true);
        });
    });
});
