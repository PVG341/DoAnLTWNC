import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Spin, Image, Button } from 'antd';

const AdminCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3000/categories');
        setCategories(res.data);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách danh mục:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    { title: 'Tên danh mục', dataIndex: 'cat_name', key: 'cat_name' },
    { title: 'Danh mục Mẹ', dataIndex: 'parentCategory', key: 'parentCategory' },

    {
      title: 'Chỉnh sửa',
      key: 'edit',
      render: (_, record) => (
        <Button type="link" onClick={() => console.log("Chỉnh sửa", record)}>
          Chỉnh sửa
        </Button>
      ),
    },
    {
      title: 'Xóa',
      key: 'delete',
      render: (_, record) => (
        <Button type="link" danger onClick={() => console.log("Xóa", record)}>
          Xóa
        </Button>
      ),
    },
  ];

  return loading ? (
    <Spin size="large" />
  ) : (
    <Table
      dataSource={categories}
      columns={columns}
      rowKey={(record) => record._id}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default AdminCategory;
