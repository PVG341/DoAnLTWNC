import React, { useState } from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { HomeOutlined } from '@ant-design/icons';
import NotifyComponent from '../../components/NotifyComponent/NotifyComponent';

const SignUpPage = () => {
    const [loading, setLoading] = useState(false);
    const [showNotify, setShowNotify] = useState(false);
    const [notifyProps, setNotifyProps] = useState({ status: '', title: '', btnTitle: '' });
    const navigate = useNavigate();


    const onFinish = async (values) => {
        console.log(values); // Kiểm tra dữ liệu gửi lên
        setLoading(true);
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });
    
            const data = await response.json();
            if (response.ok) {
                setNotifyProps({
                    status: 'success',
                    title: 'Đăng ký thành công!',
                    btnTitle: 'Đóng'
                });
                setShowNotify(true);
                setTimeout(() => {
                    navigate('/sign-in');
                }, 3000);
            } else {
                setNotifyProps({
                    status: 'error',
                    title: 'Đăng ký thất bại!',
                    subtitle: data.message,
                    btnTitle: 'Đóng'
                });
                setShowNotify(true);
            }
        } catch (err) {
            setNotifyProps({
                status: 'error',
                title: 'Có lỗi xảy ra!',
                subtitle: err,
                btnTitle: 'Đóng'
            });
            setShowNotify(true);
            console.error(err); // In ra lỗi để kiểm tra
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
            <div style={{ maxWidth: 400, margin: 'auto', padding: '10px', paddingTop: 50 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <h2>Đăng ký</h2>
                    <Link to={`/`}>
                        <HomeOutlined />
                    </Link>
                </div>

                <Form onFinish={onFinish} layout="vertical">
                    <Form.Item name="username" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="phone" label="Số điện thoại" rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="address" label="Địa chỉ">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="age"
                        label="Tuổi"
                        rules={[{ required: true, message: 'Vui lòng nhập tuổi' }]}
                    >
                        <InputNumber min={1} style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item
                        name="confirmPassword"
                        label="Xác nhận mật khẩu"
                        dependencies={['password']}
                        rules={[
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('Mật khẩu không khớp!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item>
                        <div>
                            <Link to={`/sign-in`}>
                                <h3>Đã có tài khoản? Đăng nhập</h3>
                            </Link>
                        </div>
                        <Button type="primary" htmlType="submit" loading={loading} block>
                            Đăng ký
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    );
};

export default SignUpPage;
