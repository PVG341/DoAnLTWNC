import React, { useState } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../../context/AuthContext';
import NotifyComponent from '../../components/NotifyComponent/NotifyComponent';

const SignInPage = () => {
    const [loading, setLoading] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });
    const navigate = useNavigate();
    const { setUser } = useAuth();

    const onFinish = async (values) => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(values),
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data.user);
                setNotifyProps({
                    status: 'success',
                    title: 'Đăng nhập thành công!',
                    btnTitle: 'Đóng'
                });
                setShowNotify(true);
            
                // Đợi một chút để context cập nhật xong
                setTimeout(() => {
                    if (data.user.role === 1) {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/');
                    }
                }, 100);
            } else {
                setNotifyProps({
                    status: 'error',
                    title: 'Đăng nhập thất bại!',
                    subtitle: data.message,
                    btnTitle: 'Đóng'
                });
                setShowNotify(true);
            }
        } catch (err) {
            setNotifyProps({
                status: 'error',
                title: 'Đăng nhập thất bại!',
                subtitle: err,
                btnTitle: 'Đóng'
            });
            setShowNotify(true);
        } finally {
            setLoading(false);
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
        
            <div style={{ maxWidth: 400, margin: 'auto', paddingTop: 50 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>Đăng nhập</h2>
                    <Link to={`/`}>
                        <HomeOutlined />
                    </Link>
                </div>
                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <div>
                            <Link to={`/sign-up`}>
                                <h3>Đăng kí</h3>
                            </Link>
                        </div>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Đăng nhập
                        </Button>
                    </Form.Item>
                </Form>
            </div>
    </>
    );
};


export default SignInPage
