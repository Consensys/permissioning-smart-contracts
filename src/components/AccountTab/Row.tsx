// Libs
import React from 'react';
import PropTypes from 'prop-types';
// Rimble Components
import { Pill, Flex, Button } from 'rimble-ui';
// Constant
import { PENDING_ADDITION, PENDING_REMOVAL, FAIL_ADDITION, FAIL_REMOVAL } from '../../constants/transactions';
// Components
import TextWithTooltip from './TextWithTooltip';
import CheckBox from '@react-native-community/checkbox';
// Styles
import styles from './styles.module.scss';

type AccountRow = {
  address: string;
  createContractPermission: boolean;
  status: string;
  isAdmin: boolean;
  deleteTransaction: (address: string) => void;
  openRemoveModal: (address: string) => void;
  setCreateContractPermission: (newValue: boolean) => void;
};

const AccountRow: React.FC<AccountRow> = ({
  address,
  status,
  createContractPermission,
  isAdmin,
  deleteTransaction,
  openRemoveModal,
  setCreateContractPermission
}) => (
  <tr className={styles.row}>
    <td>
      <Flex alignItems="center" className={styles.tooltipFix}>
        <TextWithTooltip status={status} text={address} isAdmin={isAdmin} />
        <CheckBox disabled={true} value={createContractPermission} />
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
            <Pill color="green" ml={2} className={styles.pill} onClick={() => deleteTransaction(address)}>
              Clear
            </Pill>
          </Flex>
        ) : status === FAIL_REMOVAL ? (
          <Flex>
            <Pill color="#FF1C1E" className={styles.pill}>
              Removal Failed
            </Pill>
            <Pill color="green" ml={2} className={styles.pill} onClick={() => deleteTransaction(address)}>
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
            onClick={() => openRemoveModal(address)}
          />
        )}
      </Flex>
    </td>
  </tr>
);

AccountRow.propTypes = {
  address: PropTypes.string.isRequired,
  createContractPermission: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  isAdmin: PropTypes.bool.isRequired,
  deleteTransaction: PropTypes.func.isRequired,
  openRemoveModal: PropTypes.func.isRequired,
  setCreateContractPermission: PropTypes.func.isRequired
};

export default AccountRow;
