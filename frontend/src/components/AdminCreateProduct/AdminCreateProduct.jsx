import React, { useEffect, useState } from 'react';
import { Form, Input, InputNumber, Button, Upload, message, Select } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const AdminCreateProduct = () => {
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
    const formData = new FormData();
    const imageFile = values.imageFile?.originFileObj;

    if (!imageFile) {
      message.error('Hãy chọn ảnh sản phẩm');
      return;
    }

    formData.append('name', values.name);
    formData.append('category_id', values.category_id); // sẽ là ObjectId
    formData.append('rate', values.rate ?? 0);
    formData.append('p_brand', values.p_brand);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('imageName', values.imageName);
    formData.append('imageFile', imageFile);

    try {
      await axios.post('http://localhost:3000/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      setNotifyProps({
        status: 'success',
        title: 'Thêm sản phẩm thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      form.resetFields();
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Thêm sản phẩm thất bại!',
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
        <h2>Thêm sản phẩm mới</h2>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="category_id" label="Danh mục" rules={[{ required: true }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.cat_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="rate" label="Đánh giá (rate)">
            <InputNumber min={0} max={5} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="p_brand" label="Thương hiệu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={4} />
          </Form.Item>

          <Form.Item name="imageName" label="Tên file ảnh (.jpg)" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="imageFile"
            label="Ảnh sản phẩm"
            valuePropName="file"
            getValueFromEvent={(e) => e?.fileList?.[0]}
            rules={[{ required: true, message: 'Hãy chọn ảnh sản phẩm' }]}
          >
            <Upload listType="picture" beforeUpload={() => false} maxCount={1}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm sản phẩm
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default AdminCreateProduct;
