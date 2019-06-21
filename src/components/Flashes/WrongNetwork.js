// Libs
import React from "react";
import PropTypes from "prop-types";
// Rimble Components
import { Flash, Text, Icon, Flex } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const WrongNetwork = ({ networkId }) => (
    <Flash variant="danger">
        <Flex alignItems="center">
            <Icon name="Warning" className={styles.icon} />
            <Text bold>
                Connect to the network where the contracts are deployed.
            </Text>
        </Flex>
        <Flex alignItems="center">
            <div className={styles.icon} />
            <Text className="wrongNetworkMessage">
                Change your network using MetaMask.
                {networkId === 1
                    ? " You're currently on the Main Ethereum Network."
                    : networkId === 2
                    ? " You're currently on the Morden Classic Test Network."
                    : networkId === 3
                    ? " You're currently on the Ropsten Test Network."
                    : networkId === 4
                    ? " You're currently on the Rinkeby Test Network."
                    : networkId === 5
                    ? " You're currently on the Goerli Test Network."
                    : ` You're currently on unknown network of id ${networkId}.`}
            </Text>
        </Flex>
    </Flash>
);

WrongNetwork.propTypes = {
    networkId: PropTypes.number.isRequired
};

export default WrongNetwork;
