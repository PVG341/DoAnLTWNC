import React from 'react';
import { Form, Input, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const AdminCreateUser = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    console.log('Dữ liệu gửi lên:', values);
    try {
      await axios.post('http://localhost:3000/api/users', values);
      message.success('Tạo người dùng thành công!');
      form.resetFields();
    } catch (error) {
      console.error('Lỗi khi tạo người dùng:', error.response?.data || error.message);
      message.error('Tạo người dùng thất bại!');
    }
  };

  return (
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
  );
};

export default AdminCreateUser;
