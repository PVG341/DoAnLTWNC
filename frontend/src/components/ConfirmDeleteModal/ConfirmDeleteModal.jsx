import React from 'react';
import { Modal } from 'antd';

const ConfirmDeleteModal = ({ visible, onCancel, onConfirm, title = "Xác nhận xoá", content }) => {
  return (
    <Modal
      open={visible}
      title={title}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Có"
      cancelText="Không"
    >
      <p>{content || "Bạn có chắc chắn muốn xoá mục này không?"}</p>
    </Modal>
  );
};

export default ConfirmDeleteModal;
