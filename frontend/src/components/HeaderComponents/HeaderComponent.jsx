// HeaderComponent.js
import React, { useState } from 'react';
import { Col } from 'antd'; 
import { Link } from 'react-router-dom';
import { WraperHeader, WrapperHeaderAccount, WrapperTextHeader, WrapperTextHeaderSmall } from './style';
import Search from 'antd/es/transfer/search';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import CartModalComponent from '../CartModalComponent/CartModalComponent';
import { useAuth } from '../../context/AuthContext'; 

const HeaderComponent = () => {
  const { user, setUser, loading } = useAuth(); // Lấy thông tin người dùng từ AuthContext
  const [isCartVisible, setIsCartVisible] = useState(false);

  const toggleCart = () => {
    setIsCartVisible(!isCartVisible);
  };

  const handleCheckout = () => {
    console.log('Thanh toán...');
    setIsCartVisible(false);
  };

  const handleLogout = () => {
    fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          setUser(null); // Xoá user trong context
          window.location.href = '/'; // Quay về trang chủ
        }
      })
      .catch(err => console.error('Lỗi khi đăng xuất:', err));
  };

  if (loading) {
    return <div>Loading...</div>; // Hiển thị trong khi đang xác thực
  }

  return (
    <div>
      <WraperHeader>
        <Col span={6}>
          <Link to={`/`}>
            <WrapperTextHeader>Logo</WrapperTextHeader>
          </Link>
        </Col>

        <Col span={12}>
          <Search
            placeholder="Tìm kiếm sản phẩm..."
            allowClear
            enterButton="Search"
            size="large"
          />
        </Col>

        <Col span={6}>
          <WrapperHeaderAccount>
            <UserOutlined />
            <div>
              {user ? (
                <span style={{ cursor: 'pointer' }} onClick={handleLogout}>
                  Đăng xuất
                </span>
              ) : (
                <Link to={`/sign-in`}>
                  <span>Đăng nhập / Đăng kí</span>
                </Link>
              )}
            </div>
          </WrapperHeaderAccount>

          <div>
            <ShoppingCartOutlined onClick={toggleCart} />
            <WrapperTextHeaderSmall>Giỏ Hàng</WrapperTextHeaderSmall>
          </div>
        </Col>
      </WraperHeader>

      <CartModalComponent
        isVisible={isCartVisible}
        onClose={toggleCart}
        onCheckout={handleCheckout}
      />
    </div>
  );
};

export default HeaderComponent;
