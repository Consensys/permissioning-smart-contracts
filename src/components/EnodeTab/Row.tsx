// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Pill, Flex, Button } from 'rimble-ui';
// Util Helper
import hexToIp from '../../util/ipConverter';
// Constant
import { PENDING_ADDITION, PENDING_REMOVAL, FAIL_ADDITION, FAIL_REMOVAL } from '../../constants/transactions';
// Components
import TextWithTooltip from './TextWithTooltip';
// Styles
import styles from './styles.module.scss';

type EnodeRow = {
  isAdmin: boolean;
  deleteTransaction: (address: string) => void;
  openRemoveModal: (address: string) => void;
  enodeHigh: string;
  enodeLow: string;
  ip: string;
  port: string;
  status: string;
  identifier: string;
};

const EnodeRow: React.FC<EnodeRow> = ({
  isAdmin,
  deleteTransaction,
  openRemoveModal,
  enodeHigh,
  enodeLow,
  ip,
  port,
  status,
  identifier
}) => (
  <tr className={styles.row}>
    <td colSpan={2}>
      <Flex alignItems="center" className={styles.tooltipFix}>
        <TextWithTooltip isAdmin={isAdmin} status={status} text={`${enodeHigh}${enodeLow}`} />
      </Flex>
    </td>
    <td>
      <Flex alignItems="center" className={styles.tooltipFix}>
        <TextWithTooltip isAdmin={isAdmin} status={status} text={hexToIp(ip)} />
      </Flex>
    </td>
    <td>
      <Flex alignItems="center" className={styles.tooltipFix}>
        <TextWithTooltip isAdmin={isAdmin} status={status} text={port} />
      </Flex>
    </td>
    <td>
      <Flex justifyContent="space-between" alignItems="center">
        {status === 'active' ? (
          <Pill color="#018002" className={styles.pill}>
            Active
          </Pill>
        ) : status === PENDING_ADDITION ? (
          <Pill color="#FFA505" className={styles.pill}>
            Pending Addition
          </Pill>
        ) : status === PENDING_REMOVAL ? (
          <Pill color="#FFA505" className={styles.pill}>
            Pending Removal
          </Pill>
        ) : status === FAIL_ADDITION ? (
          <Flex>
            <Pill color="#FF1C1E" className={styles.pill}>
              Addition Failed
            </Pill>
            <Pill color="green" ml={2} className={styles.pill} onClick={() => deleteTransaction(identifier)}>
              Clear
            </Pill>
          </Flex>
        ) : status === FAIL_REMOVAL ? (
          <Flex>
            <Pill color="#FF1C1E" className={styles.pill}>
              Removal Failed
            </Pill>
            <Pill color="green" ml={2} className={styles.pill} onClick={() => deleteTransaction(identifier)}>
              Clear
            </Pill>
          </Flex>
        ) : (
          <div />
        )}
        {isAdmin && status === 'active' && (
          <Button.Text
            mainColor="#CCC"
            icon="Delete"
            icononly
            className={styles.removeIcon}
            onClick={() => openRemoveModal(identifier)}
          />
        )}
      </Flex>
    </td>
  </tr>
);

EnodeRow.propTypes = {
  enodeHigh: PropTypes.string.isRequired,
  enodeLow: PropTypes.string.isRequired,
  ip: PropTypes.string.isRequired,
  port: PropTypes.string.isRequired,
  identifier: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired
};

export default EnodeRow;
