import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Image, Button, Modal, Form, Input, InputNumber, Select } from 'antd';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const AdminProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });
  const [form] = Form.useForm();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/categories');
      setCategories(res.data);
      console.log('Dữ liệu danh mục:', res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục:', err);
    }
  };
  

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/products');
      setProducts(res.data);
      console.log('Dữ liệu sản phẩm:', res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryName = (id) => {
    const found = categories.find(cat => cat._id === id);
    return found ? found.cat_name : 'Không xác định';
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
      setNotifyProps({
        status: 'success',
        title: 'Cập nhật sản phẩm thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      setEditModalVisible(false);
      fetchProducts();
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Cập nhật sản phẩm thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/products/${productId}`);
      setNotifyProps({
        status: 'success',
        title: 'Xóa sản phẩm thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      fetchProducts(); // Cập nhật lại danh sách sản phẩm sau khi xóa
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Xóa sản phẩm thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    } finally {
      setDeleteModalVisible(false);
      setProductToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    await handleDeleteProduct(productToDelete._id);
  };

  const columns = [
    { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name' },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
      render: (id) => getCategoryName(id),
    },
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
        <Button
          type="link"
          danger
          onClick={() => {
            setProductToDelete(record);
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
        title="Xác nhận xoá sản phẩm"
        content={`Bạn có muốn xoá sản phẩm "${productToDelete?.name}" không?`}
      />

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
          <Form.Item name="category_id" label="Danh mục" rules={[{ required: true }]}>
            <Select placeholder="Chọn danh mục">
              {categories.map((cat) => (
                <Select.Option key={cat._id} value={cat._id}>
                  {cat.cat_name}
                </Select.Option>
              ))}
            </Select>
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
