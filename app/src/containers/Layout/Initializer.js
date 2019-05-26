// Libs
import React from "react";
import PropTypes from "prop-types";
// Context
import { useNetwork } from "../../context/network";

const Initializer = ({ children, NoProvider, WrongNetwork }) => {
    const { networkId, isCorrectNetwork, web3Initialized } = useNetwork();
    const noDetectedProvider = networkId === undefined;
    return !web3Initialized ? null : noDetectedProvider ? (
        <NoProvider />
    ) : isCorrectNetwork ? (
        children
    ) : (
        <WrongNetwork networkId={networkId} />
    );
};

Initializer.propTypes = {
    children: PropTypes.object.isRequired,
    NoProvider: PropTypes.object.isRequired,
    WrongNetwork: PropTypes.object.isRequired
};

export default Initializer;
