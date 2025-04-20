import React, { useState } from 'react';
import { Layout, Menu } from 'antd';
import { UserOutlined, ShoppingOutlined, AppstoreOutlined, UserAddOutlined, PlusCircleOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom'; // Để chuyển hướng sau khi đăng xuất
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminUser from '../../components/adminUser/AdminUser';
import AdminCategory from '../../components/AdminCategory/AdminCategory';
import AdminCreateCategory from '../../components/AdminCreateCategory/AdminCreateCategory';
import AdminCreateUser from '../../components/AdminCreateUser/AdminCreateUser';
import AdminCreateProduct from '../../components/AdminCreateProduct/AdminCreateProduct';

const { Sider, Content } = Layout;

const AdminPage = () => {
  const [selectedKey, setSelectedKey] = useState('products');
  const navigate = useNavigate(); // Hook để chuyển hướng

  // Xử lý đăng xuất
  const handleLogout = () => {
    // Xóa token hoặc dữ liệu đăng nhập
    localStorage.removeItem('token'); // Hoặc sessionStorage.removeItem('token') tùy thuộc vào cách lưu trữ token

    // Chuyển hướng người dùng về trang đăng nhập
    navigate('/');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={200} style={{ background: '#fff' }}>
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}  // Thay đổi khi click
          style={{ height: '100%', borderRight: 0 }}
        >
          {/* Các mục menu */}
          <Menu.Item key="add-user" icon={<UserAddOutlined />}>
            Thêm người dùng
          </Menu.Item>
          <Menu.Item key="users" icon={<UserOutlined />}>
            Người dùng
          </Menu.Item>
          <Menu.Item key="products" icon={<ShoppingOutlined />}>
            Sản phẩm
          </Menu.Item>
          <Menu.Item key="add-product" icon={<PlusCircleOutlined />}>
            Thêm Sản phẩm
          </Menu.Item>
          <Menu.Item key="categories" icon={<AppstoreOutlined />}>
            Danh mục
          </Menu.Item>
          <Menu.Item key="add-category" icon={<PlusSquareOutlined />}>
            Thêm danh mục
          </Menu.Item>
          
          {/* Nút đăng xuất */}
          <Menu.Item key="logout" icon={<UserOutlined />} onClick={handleLogout} style={{ marginTop: 'auto' }}>
            Đăng xuất
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout style={{ padding: '24px' }}>
        <Content style={{ background: '#fff', padding: 24, minHeight: 280 }}>
          {selectedKey === 'products' ? (
            <AdminProduct />
          ) : selectedKey === 'users' ? (
            <AdminUser />
          ) : selectedKey === 'categories' ? (
            <AdminCategory />
          ) : selectedKey === 'add-user' ? (
            <AdminCreateUser />
          ) : selectedKey === 'add-category' ? (
            <AdminCreateCategory />
          ) : selectedKey === 'add-product' ? (
            <AdminCreateProduct />
          ) : (
            <div>Không tìm thấy nội dung</div>
          )}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminPage;
