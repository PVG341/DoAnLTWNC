import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';
import axios from 'axios';
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const { Option } = Select;

const AdminCreateUser = () => {
  const [form] = Form.useForm();
  const [showNotify, setShowNotify] = useState(false);
  const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });

  const onFinish = async (values) => {
    console.log('Dữ liệu gửi lên:', values);
    try {
      await axios.post('http://localhost:3000/api/users', values);
      setNotifyProps({
        status: 'success',
        title: 'Thêm người dùng thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      form.resetFields();
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Thêm người dùng thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    }
  };

  return (
    <>
      {showNotify && (
        <NotifyComponent
          status={notifyProps.status}
          title={notifyProps.title}
          btnTitle={notifyProps.btnTitle}
          onClose={() => setShowNotify(false)}
        />
      )}

      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <h2 style={{ marginBottom: 24 }}>Thêm người dùng mới</h2>
        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          <Form.Item
            label="Tên người dùng"
            name="username"
            rules={[{ required: true, message: 'Vui lòng nhập tên người dùng' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            label="Số điện thoại"
            name="phone"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Tuổi"
            name="age"
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Địa chỉ"
            name="address"
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="0">Người dùng</Option>
              <Option value="1">Quản trị viên</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tạo người dùng
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
    
  );
};

export default AdminCreateUser;
