import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Form, Input, InputNumber, Select, Button, Spin, Table } from 'antd';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });
  const [form] = Form.useForm();

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/users');
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách người dùng:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const showEditModal = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalVisible(true);
  };

  const handleUpdateUser = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(`http://localhost:3000/api/users/${editingUser._id}`, values);
      setIsModalVisible(false);
      setNotifyProps({
        status: 'success',
        title: 'Cập nhật người dùng thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      fetchUsers(); // Gọi lại danh sách sau khi cập nhật
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Cập nhật người dùng thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      // Cập nhật lại danh sách sau khi xóa
      setNotifyProps({
        status: 'success',
        title: 'Xóa người dùng thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      fetchUsers();
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Xóa người dùng thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    } finally {
      setDeleteModalVisible(false);
      setUserToDelete(null);
    }
  };
  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    await handleDeleteUser(userToDelete._id);
  };

  const columns = [
    { title: 'Tên người dùng', dataIndex: 'username', key: 'username' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Số điện thoại', dataIndex: 'phone', key: 'phone' },
    { title: 'Tuổi', dataIndex: 'age', key: 'age' },
    { title: 'Địa chỉ', dataIndex: 'address', key: 'address' },
    { title: 'Vai trò', dataIndex: 'role', key: 'role' },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      render: (_, record) => (
        <Button type="link" onClick={() => showEditModal(record)}>Chỉnh sửa</Button>
      ),
    },
    {
      title: 'Xóa',
      key: 'delete',
      render: (_, record) => (
        <Button
          type="link"
          danger
          onClick={() => {
            setUserToDelete(record);
            setDeleteModalVisible(true);
          }}
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      {loading ? <Spin size="large" /> : (
        <Table dataSource={users} columns={columns} rowKey={(record) => record._id} />
      )}

      {showNotify && (
        <NotifyComponent
          status={notifyProps.status}
          title={notifyProps.title}
          btnTitle={notifyProps.btnTitle}
          onClose={() => setShowNotify(false)}
        />
      )}

      <ConfirmDeleteModal
        visible={deleteModalVisible}
        onCancel={() => setDeleteModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xoá người dùng"
        content={`Bạn có muốn xoá người dùng "${userToDelete?.username}" không?`}
      />

      <Modal
        title="Chỉnh sửa người dùng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleUpdateUser}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="username" label="Tên người dùng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Địa chỉ">
            <Input />
          </Form.Item>
          <Form.Item name="age" label="Tuổi" rules={[{ required: true, type: 'number', min: 1 }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
            <Select>
              <Select.Option value={0}>Người dùng</Select.Option>
              <Select.Option value={1}>Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminUser;
