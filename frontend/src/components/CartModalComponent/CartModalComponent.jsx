import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'antd';
import { Link } from 'react-router-dom';

const CartModalComponent = ({ isVisible, onClose }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [cart, setCart] = useState([]);

    useEffect(() => {
        if (isVisible) {
            fetch('http://localhost:3000/api/cart', {
                credentials: 'include'
            })
            .then(res => {
                if (res.status === 401) {
                    setIsLoggedIn(false);
                    return;
                }
                return res.json();
            })
            .then(data => {
                if (data) {
                    setIsLoggedIn(true);
                    setCart(data.cart);
                }
            })
            .catch(error => {
                console.error("Lỗi lấy giỏ hàng:", error);
                setIsLoggedIn(false);
            });
        }
    }, [isVisible]);
    const handleRemove = (productId) => {
        fetch('http://localhost:3000/api/cart/remove', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId })
        })
        .then(res => res.json())
        .then(data => {
            // Cập nhật giỏ hàng sau khi xoá
            setCart(data.cart);
        })
        .catch(err => {
            console.error("Lỗi khi xoá sản phẩm:", err);
        });
    };
    return (
        <Modal
            title="Giỏ hàng"
            visible={isVisible}
            onCancel={onClose}
            footer={null}
        >
            {!isLoggedIn ? (
                <div style={{ textAlign: 'center' }}>
                    <p>Bạn cần phải đăng nhập để sử dụng chức năng này.</p>
                    <Link to="/sign-up">
                        <Button type="primary">Đăng nhập</Button>
                    </Link>
                </div>
            ) : (
                <div>
                {cart.length === 0 ? (
                    <p>Giỏ hàng của bạn đang trống.</p>
                ) : (
                    cart.map((item, index) => (
                        <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                            <img src={`http://localhost:3000${item.image}`} alt={item.name} style={{ width: 60, marginRight: 10 }} />
                            <div>
                                <p><strong>{item.name}</strong></p>
                                <p>Số lượng: {item.quantity}</p>
                                <p>Giá: {item.price.toLocaleString()}₫</p>
                            </div>
                            <Button type="link" danger onClick={() => handleRemove(item.id)}>
                                Xoá
                            </Button>
                        </div>
                    ))
                )}
                </div>
            )}
        </Modal>
    );
};

export default CartModalComponent;
