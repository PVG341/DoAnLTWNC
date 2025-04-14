import React from 'react';
import { Form, Input, InputNumber, Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const AdminCreateProduct = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    const formData = new FormData();

    // Lấy file từ field upload
    const imageFile = values.imageFile?.originFileObj;

    if (!imageFile) {
      message.error('Hãy chọn ảnh sản phẩm');
      return;
    }

    formData.append('name', values.name);
    formData.append('category_id', values.category_id);
    formData.append('rate', values.rate ?? 0);
    formData.append('p_brand', values.p_brand);
    formData.append('price', values.price);
    formData.append('description', values.description);
    formData.append('imageName', values.imageName);
    formData.append('imageFile', imageFile); // File ảnh

    try {
      await axios.post('http://localhost:3000/products/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });
      message.success('Thêm sản phẩm thành công!');
      form.resetFields();
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        message.error(err.response.data.message);
      } else {
        message.error('Lỗi khi thêm sản phẩm');
      }
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Thêm sản phẩm mới</h2>
      <Form layout="vertical" form={form} onFinish={onFinish} >
        <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="category_id" label="ID danh mục" rules={[{ required: true }]}>
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="rate"
          label="Đánh giá (rate)"
          rules={[{ required: false, message: 'Hãy nhập đánh giá' }]}
        >
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
        <Form.Item name="imageName" label="Tên file ảnh (không có đuôi .jpg)" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        {/* Đây là phần QUAN TRỌNG */}
        <Form.Item
          name="imageFile"
          label="Ảnh sản phẩm"
          valuePropName="file"
          getValueFromEvent={(e) => {
            return e?.fileList?.[0];
          }}
          rules={[{ required: true, message: 'Hãy chọn ảnh sản phẩm' }]}
        >
          <Upload
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
          >
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
  );
};

export default AdminCreateProduct;
