import React, { useState } from 'react';
import { Input, Button, Form, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './style/userPassword.css'
import { updateUserLoginPassword } from '../../api';

const getCurrentUser = () => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
        return JSON.parse(storedUserData);
    }
};

const UserPassword = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const account = getCurrentUser().accountName;

    const handleSubmit = (values) => {
        // 提交密码修改逻辑
        const { oldPassword, newPassword, confirmPassword } = values;

        if (newPassword !== confirmPassword) {
            message.error('新密码和确认密码不一致');
            return;
        }

        const updateData = {
            oldPassword: oldPassword,
            newPassword: newPassword
        }
        setLoading(true);
        updateUserLoginPassword(updateData).then((res) => {
            if(res === 1){
                form.resetFields();
                message.success('密码更新成功');
            }
            else
                message.error('密码更新失败');

            setLoading(false);
        }).catch(err => {
            message.error('密码更新失败');
            setLoading(false);
        });
    };

    return (
        <div className="password-management-container">
            <h2>登录密码修改</h2>
            <div className="account-info">
                <p><strong>账户：</strong>{account}</p>
            </div>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="password-form"
            >
                <Form.Item
                    label="旧密码"
                    name="oldPassword"
                    rules={[{ required: true, message: '请输入旧密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入旧密码"
                    />
                </Form.Item>
                
                <Form.Item
                    label="新密码"
                    name="newPassword"
                    rules={[{ required: true, message: '请输入新密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="请输入新密码"
                    />
                </Form.Item>

                <Form.Item
                    label="确认新密码"
                    name="confirmPassword"
                    rules={[{ required: true, message: '请确认新密码' }]}
                >
                    <Input.Password
                        prefix={<LockOutlined />}
                        placeholder="确认新密码"
                    />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        更新密码
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default UserPassword;
