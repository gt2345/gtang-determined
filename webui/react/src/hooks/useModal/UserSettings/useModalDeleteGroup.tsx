import { message } from 'antd';
import React, { useCallback } from 'react';

import { deleteGroup } from 'services/api';
import { V1GroupSearchResult } from 'services/api-ts-sdk';
import useModal, { ModalHooks } from 'shared/hooks/useModal/useModal';
import { ErrorType } from 'shared/utils/error';
import handleError from 'utils/error';

export const API_SUCCESS_MESSAGE = 'Group deleted.';

interface ModalProps {
  group: V1GroupSearchResult;
  onClose?: () => void;
}

const useModalDeleteGroup = ({ onClose, group }: ModalProps): ModalHooks => {

  const { modalOpen: openOrUpdate, ...modalHook } = useModal();
  const handleOkay = useCallback(async () => {
    if (!group.group.groupId) return;
    try {
      await deleteGroup({ groupId: group.group.groupId });
      message.success(API_SUCCESS_MESSAGE);
      onClose?.();
    } catch (e) {
      message.error('error deleting group');
      handleError(e, { silent: true, type: ErrorType.Input });

      // Re-throw error to prevent modal from getting dismissed.
      throw e;
    }
  }, [ onClose, group ]);

  const modalOpen = useCallback(() => {
    openOrUpdate({
      closable: true,
      content:
      `Are you sure you want to delete group ${group.group.name} (ID: ${group.group.groupId}).`,
      icon: null,
      okButtonProps: { danger: true },
      okText: 'Delete',
      onOk: handleOkay,
      title: <h5>Delete Group</h5>,
    });
  }, [ handleOkay, openOrUpdate, group ]);

  return { modalOpen, ...modalHook };
};

export default useModalDeleteGroup;
