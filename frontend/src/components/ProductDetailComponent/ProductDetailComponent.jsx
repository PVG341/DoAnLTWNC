import React, { useState } from 'react';
import { Col, Image, InputNumber, Row } from 'antd'
import { WrapperBtnQuantityProduct, WrapperInputNumber, WrapperPriceTextProduct, WrapperProductPrice, WrapperQualityProduct, WrapperStyleColImage, WrapperStyleImageSmall, WrapperStyleNameProduct } from './style'
import ButtonComponent from '../ButtonComponent/ButtonComponent'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import NotifyComponent from '../NotifyComponent/NotifyComponent';

const ProductDetailComponent = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [showNotify, setShowNotify] = useState(false);
  const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });

  const handleChangeQuantity = (value) => {
    if (value >= 1) setQuantity(value);
  };

  const increaseQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/cart/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // để gửi cookie nếu có
        body: JSON.stringify({
          productId: product._id,
          quantity: quantity,
        }),
      });
  
      const data = await response.json();
      if (response.ok) {
        setNotifyProps({
          status: 'success',
          title: 'Thêm vào giỏ hàng thành công!',
          btnTitle: 'Đóng'
        });
        setShowNotify(true);
      } else {
        setNotifyProps({
          status: 'error',
          title: 'Lỗi khi thêm vào giỏ hàng!',
          subtitle: data.message,
          btnTitle: 'Đóng'
        });
        setShowNotify(true);
      }
    } catch (err) {
      setNotifyProps({
        status: 'error',
        title: 'Xóa người dùng thất bại!',
        subtitle: err,
        btnTitle: 'Đóng'
      });
      setShowNotify(true);
    }
  };
  
  const handleBuyNow = () => {
    handleAddToCart();
    // Sau khi thêm vào giỏ hàng, có thể chuyển hướng đến trang thanh toán
    // navigate('/checkout');
  };
  const onChange = () => {}

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
    
      <Row style={{ padding: '16px', background: '#fff' }}>
        <Col span={10}>
          <Image src={`http://localhost:3000${product.image}`} alt={product.name} preview={false} />
          <Row style={{ paddingTop: '10px', justifyContent: 'space-between' }}>
            {[...Array(5)].map((_, i) => (
              <WrapperStyleColImage span={4} key={i}>
                <WrapperStyleImageSmall src={`http://localhost:3000${product.image}`} alt={`image small ${i}`} preview={false} />
              </WrapperStyleColImage>
            ))}
          </Row>
        </Col>
        <Col span={14}>
          <WrapperStyleNameProduct>{product.name}</WrapperStyleNameProduct>
          <WrapperProductPrice>
            <WrapperPriceTextProduct>{product.price.toLocaleString()} VNĐ</WrapperPriceTextProduct>
          </WrapperProductPrice>
          <div>
            <div>Số Lượng</div>
            <WrapperQualityProduct>
              <WrapperBtnQuantityProduct onClick={decreaseQuantity}>
                <MinusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </WrapperBtnQuantityProduct>

              <WrapperInputNumber min={1} value={quantity} onChange={handleChangeQuantity} />

              <WrapperBtnQuantityProduct onClick={increaseQuantity}>
                <PlusOutlined style={{ color: '#000', fontSize: '20px' }} />
              </WrapperBtnQuantityProduct>
            </WrapperQualityProduct>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <ButtonComponent
                bordered={false}
                size={40}
                onClick={handleBuyNow}
                styleButton={{ background: 'rgb(255, 57, 69)', height: '48px', width: '220px', border: 'none', borderRadius: '4px' }}
                textButton={'Mua'}
                styleTextButton={{ color: '#fff' }}
              />
              <ButtonComponent
                bordered={false}
                size={40}
                onClick={handleAddToCart}
                styleButton={{ background: 'rgb(255, 57, 69)', height: '48px', width: '220px', border: 'none', borderRadius: '4px' }}
                textButton={'Thêm vào giỏ hàng'}
                styleTextButton={{ color: '#fff' }}
              />
            </div>
        </Col>
      </Row>
    </>
  )
}

export default ProductDetailComponent
