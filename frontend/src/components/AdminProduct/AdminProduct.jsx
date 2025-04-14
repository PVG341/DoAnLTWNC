import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Image, Button, Modal, Form, Input, InputNumber, message } from 'antd';

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setEditModalVisible(true);
  };

  const handleUpdateProduct = async (values) => {
    try {
      await axios.put(`http://localhost:3000/products/${editingProduct._id}`, values, {
        withCredentials: true,
      });
      message.success('Cập nhật sản phẩm thành công!');
      setEditModalVisible(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi cập nhật sản phẩm');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/products/${productId}`);
      message.success('Sản phẩm đã được xóa!');
      fetchProducts(); // Cập nhật lại danh sách sản phẩm sau khi xóa
    } catch (err) {
      console.error('Lỗi khi xóa sản phẩm:', err);
      message.error('Lỗi khi xóa sản phẩm');
    }
  };

  const columns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    { title: 'Danh mục', dataIndex: 'category_id', key: 'category_id' },
    { title: 'Thương hiệu', dataIndex: 'p_brand', key: 'p_brand' },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image, record) => (
        <Image
          width={80}
          height={80}
          src={`http://localhost:3000${image}`}
          alt={record.name}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Chỉnh sửa
        </Button>
      ),
    },
    {
      title: 'Xóa',
      key: 'delete',
      render: (_, record) => (
        <Button type="link" danger onClick={() => handleDeleteProduct(record._id)}>
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      {loading ? (
        <Spin size="large" />
      ) : (
        <Table
          dataSource={products}
          columns={columns}
          rowKey={(record) => record._id}
          scroll={{ x: 'max-content' }}
        />
      )}

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa sản phẩm"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={handleUpdateProduct}>
          <Form.Item name="name" label="Tên sản phẩm" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category_id" label="ID danh mục">
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="rate" label="Đánh giá (0 - 5)">
            <InputNumber min={0} max={5} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="p_brand" label="Thương hiệu" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item name="description" label="Mô tả" rules={[{ required: true }]}>
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminProduct;
