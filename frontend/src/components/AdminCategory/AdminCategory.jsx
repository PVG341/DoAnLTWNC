import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Button, Modal, Form, Input, Select, message } from 'antd';
import ConfirmDeleteModal from '../ConfirmDeleteModal/ConfirmDeleteModal';
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });
  const [form] = Form.useForm();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await axios.get('http://localhost:3000/api/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách danh mục:', err);
      message.error('Lỗi khi tải danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const showEditModal = (category) => {
    setEditingCategory(category);
    setIsModalVisible(true);
    form.setFieldsValue({
      cat_name: category.cat_name,
      parentCategory: category.parentCategory?._id || null,
    });
  };

  const handleEdit = async () => {
    try {
      const values = await form.validateFields();

      await axios.put(`http://localhost:3000/api/categories/${editingCategory._id}`, {
        cat_name: values.cat_name,
        parentCategory: values.parentCategory || null,
      });

      setNotifyProps({
        status: 'success',
        title: 'Cập nhật danh mục thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      setIsModalVisible(false);
      fetchCategories();
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Cập nhật danh mục thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    }
  };

  const handleDeleteCategory = async (CategoryId) => {
    try {
      await axios.delete(`http://localhost:3000/api/categories/${CategoryId}`);
      setNotifyProps({
        status: 'success',
        title: 'Xóa danh mục thành công!',
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
      fetchCategories(); // Cập nhật lại danh sách Danh mục sau khi xóa
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Xóa danh mục thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    } finally {
      setDeleteModalVisible(false);
      setCategoryToDelete(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    await handleDeleteCategory(categoryToDelete._id);
  };

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'cat_name', key: 'cat_name' },
    {
      title: 'Danh mục Mẹ',
      dataIndex: 'parentCategory',
      key: 'parentCategory',
      render: (parentCategory) => (parentCategory ? parentCategory.cat_name : 'Không có danh mục mẹ'),
    },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      render: (_, record) => (
        <Button type="link" onClick={() => showEditModal(record)}>
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
            setCategoryToDelete(record);
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
          dataSource={categories}
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
        title="Xác nhận xoá danh mục"
        content={`Bạn có muốn xoá danh mục "${categoryToDelete?.cat_name}" không?`}
      />

      <Modal
        title="Chỉnh sửa danh mục"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleEdit}
        okText="Lưu thay đổi"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="cat_name" label="Tên danh mục" rules={[{ required: true, message: 'Vui lòng nhập tên' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="parentCategory" label="Danh mục mẹ">
            <Select placeholder="Chọn danh mục mẹ (tuỳ chọn)" allowClear>
              {categories
                .filter((cat) => cat._id !== editingCategory?._id) // tránh cho tự chọn chính mình làm cha
                .map((cat) => (
                  <Select.Option key={cat._id} value={cat._id}>
                    {cat.cat_name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AdminCategory;
