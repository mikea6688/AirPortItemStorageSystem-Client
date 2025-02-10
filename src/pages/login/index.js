import React, { useState } from 'react';
import { Input, Button, Form, message, Space, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../api';
import './login.css';

const { Title } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (values) => {
    setLoading(true);
    localStorage.clear();
    loginUser(values)
      .then((response) => {
        const userData = response.user; 
        const token = response.token; 
        console.log(token)
        localStorage.setItem("token", token); 
        localStorage.setItem("user", JSON.stringify(userData));
        
        message.success("登录成功");
        navigate("/main/home");
      })
      .catch((error) => {
        message.error("登录失败");
      })
      .finally(() => {
        setLoading(false);
      });
  };


  return (
    <div className="login-container">
      <div className="login-form-container">
        <Title level={3} className="login-title">
          用户登录
        </Title>

        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          {/* 用户名输入框 */}
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入您的用户名!' }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
              className="login-input"
            />
          </Form.Item>

          {/* 密码输入框 */}
          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入您的密码!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
              className="login-input"
            />
          </Form.Item>

          {/* 登录按钮 */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              className="login-button"
            >
              登录
            </Button>
          </Form.Item>

          {/* 注册通道 */}
          <Form.Item className="register-link">
            <Space>
              <span>还没有账户？</span>
              <Link to="/register" className="link-text">
                注册
              </Link>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
