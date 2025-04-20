import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, Form, Input, message, Select } from 'antd';
import NotifyComponent from '../NotifyComponent/NotifyComponent';


const AdminCreateCategory = () => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState([]);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });

  useEffect(() => {
    // Lấy danh sách category
    const fetchCategories = async () => {
      try {
        const res = await axios.get('http://localhost:3000/api/categories');
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        message.error('Không thể tải danh mục');
      }
    };
    fetchCategories();
  }, []);

  const onFinish = async (values) => {
    try {
      await axios.post('http://localhost:3000/api/categories/add', {
        name: values.name,
        category_id: values.parentCategory || null,
      }, {
        withCredentials: true,
      });
      setNotifyProps({
        status: 'success',
        title: 'Thêm danh mục thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      form.resetFields();
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Thêm danh mục thất bại!',
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
        <h2>Thêm danh mục mới</h2>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="parentCategory" label="Danh mục mẹ">
            <Select placeholder="Chọn danh mục mẹ (tuỳ chọn)" allowClear>
              <Select.Option value={null}>Không có danh mục mẹ</Select.Option>
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.cat_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm danh mục
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AdminCreateCategory
