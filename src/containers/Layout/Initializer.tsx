// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Context
import { useNetwork } from '../../context/network';

const Initializer: React.FC<{ NoProvider: React.FC<{}>; WrongNetwork: React.FC<{ networkId: number }> }> = ({
  children,
  NoProvider,
  WrongNetwork
}) => {
  const { networkId, isCorrectNetwork } = useNetwork();
  if (isCorrectNetwork === undefined) {
    return <NoProvider />;
  } else if (isCorrectNetwork) {
    return <div>{children}</div>;
  } else {
    return <WrongNetwork networkId={networkId!} />;
  }
};

Initializer.propTypes = {
  NoProvider: PropTypes.func.isRequired,
  WrongNetwork: PropTypes.func.isRequired
};

export default Initializer;
