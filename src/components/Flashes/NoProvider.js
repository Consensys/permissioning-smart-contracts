// Libs
import React from "react";
// Rimble Components
import { Flash, Text, Link, Icon, Flex } from "rimble-ui";
// Styles
import styles from "./styles.module.scss";

const NoProvider = () => (
    <Flash variant="danger">
        <Flex alignItems="center">
            <Icon name="Warning" className={styles.icon} />
            <Text bold>You are not connected to your network.</Text>
        </Flex>
        <Flex alignItems="center">
            <div className={styles.icon} />
            <Text>If you need help, we recommend MetaMask to connect, see</Text>
            <Link
                ml={1}
                href="https://www.metamask.io"
                target="_blank"
                title="Access MetaMask page"
            >
                www.metamask.io
            </Link>
            <Text>.</Text>
        </Flex>
    </Flash>
);

export default NoProvider;
