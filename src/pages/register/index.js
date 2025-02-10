import React, { useState } from 'react';
import { Form, Input, Button, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './register.css';
import { registerUser } from '../../api';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onFinish = (values) => {
        setLoading(true);
        const registerData = {
            nickName: values.name,
            phone: values.phone,
            email: values.email,
            address: values.address,
            accountName: values.username,
            password: values.password,
            payPassword: values.payPassword
        }

        registerUser(registerData)
            .then((res) => {
                console.log(res);
                message.success('注册成功！');
                navigate('/login');
            })
            .catch(err => {
                console.log(err);
                message.error('注册失败，请检查输入的内容。');
            })
            .finally(() => {
                setLoading(false);
            })
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
        message.error('注册失败，请检查输入的内容。');
    };

    return (
        <div className="register-container">
            <div className="register-form">
                <h2 className="form-title">注册</h2>
                <Form
                    form={form}
                    name="register"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical"
                    initialValues={{
                        remember: true,
                    }}
                >
                    {/* 账号输入框 */}
                    <Form.Item
                        label="账号"
                        name="username"
                        rules={[{ required: true, message: '请输入账号!' }]}
                    >
                        <Input placeholder="请输入账号" />
                    </Form.Item>

                    {/* 姓名输入框 */}
                    <Form.Item
                        label="姓名"
                        name="name"
                        rules={[{ required: true, message: '请输入姓名!' }]}
                    >
                        <Input placeholder="请输入姓名" />
                    </Form.Item>

                    {/* 手机号输入框 */}
                    <Form.Item
                        label="手机号"
                        name="phone"
                        rules={[
                            { required: true, message: '请输入手机号!' },
                            { pattern: /^[0-9]{11}$/, message: '请输入有效的手机号' },
                        ]}
                    >
                        <Input placeholder="请输入手机号" />
                    </Form.Item>

                    {/* 邮箱输入框 */}
                    <Form.Item
                        label="邮箱"
                        name="email"
                        rules={[
                            { required: true, message: '请输入邮箱!' },
                            { type: 'email', message: '请输入有效的邮箱!' },
                        ]}
                    >
                        <Input placeholder="请输入邮箱" />
                    </Form.Item>

                    {/* 地址输入框 */}
                    <Form.Item
                        label="地址"
                        name="address"
                        rules={[{ required: true, message: '请输入地址!' }]}
                    >
                        <Input placeholder="请输入地址" />
                    </Form.Item>

                    {/* 登录密码输入框 */}
                    <Form.Item
                        label="登录密码"
                        name="password"
                        rules={[
                            { required: true, message: '请输入登录密码!' },
                            { min: 6, message: '密码至少为6个字符' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="请输入登录密码" />
                    </Form.Item>

                    {/* 支付密码输入框 */}
                    <Form.Item
                        label="支付密码"
                        name="payPassword"
                        rules={[
                            { required: true, message: '请输入支付密码!' },
                            { min: 6, message: '支付密码至少为6个字符' },
                        ]}
                        hasFeedback
                    >
                        <Input.Password placeholder="请输入支付密码" />
                    </Form.Item>

                    {/* 提交按钮 */}
                    <Form.Item>
                        <Space style={{ width: '200%' }} align="center">
                            <Button type="primary" htmlType="submit" block>
                                注册
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Register;