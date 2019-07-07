// Libs
import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
// Components
import PendingToast from './Pending';
import ErrorToast from './Error';
import SuccessToast from './Success';
// Constants
import { PENDING, SUCCESS, FAIL } from '../../constants/transactions';
// Rimble Components
import { Flex } from 'rimble-ui';

const Toasts = ({ toasts, closeToast }) => (
  <Flex position="absolute" bottom="50px" right="50px" flexDirection="column">
    {toasts.map(({ status, identifier, ...messages }, index) => (
      <Fragment key={index}>
        {status === PENDING && <PendingToast {...messages} closeToast={closeToast(identifier)} />}
        {status === FAIL && <ErrorToast {...messages} closeToast={closeToast(identifier)} />}
        {status === SUCCESS && (
          <SuccessToast position="absolute" bottom="0" {...messages} closeToast={closeToast(identifier)} />
        )}
      </Fragment>
    ))}
  </Flex>
);

Toasts.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.object).isRequired,
  closeToast: PropTypes.func.isRequired
};

export default memo(Toasts);
