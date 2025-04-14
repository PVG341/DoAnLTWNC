import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Form, Input, InputNumber, Select, Button, Spin, Table } from 'antd';

const AdminUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
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
      fetchUsers(); // Gọi lại danh sách sau khi cập nhật
    } catch (err) {
      console.error("Lỗi cập nhật:", err);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`);
      // Cập nhật lại danh sách sau khi xóa
      fetchUsers();
    } catch (err) {
      console.error("Lỗi xóa người dùng:", err);
    }
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
        <Button type="link" danger onClick={() => handleDeleteUser(record._id)}>
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
