import React, { useState, useEffect } from 'react';
import { Layout, InputNumber, Button, Typography, Space, Form, message } from 'antd';
import './style/userRecharge.css';
import { rechargeUserPoint, getCurrentUser } from '../../api';

const { Title, Text } = Typography;

const getUserId = () => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
        const user = JSON.parse(storedUserData);
        return user.id;
    }
};

const id = getUserId();

const UserRecharge = () => {
    const [value, setValue] = useState(0);
    const [amount, setAmount] = useState(0);
    const [userData, setUserData] = useState({ point: '' });
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    const handleChange = (value) => {
        setValue(value);
    };

    const fetchUserData = () => {
        setLoading(true);
        if (userId) {
            getCurrentUser(userId)
                .then((res) => {
                    console.log("后端返回数据:", res);
                    if (res) {
                        setUserData(res); // 假设接口返回的 `res` 是用户信息对象
                    } else {
                        console.error("返回数据格式不正确:", res);
                    }
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("获取数据失败:", error);
                    setLoading(false);
                    message.error("获取用户数据失败");
                });
        }
    };

    useEffect(() => {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            setUserId(user.id);
        }
    }, []);

    // 初始化数据
    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const handleSubmit = () => {
        setLoading(true);
        const doubleValue = parseFloat(value);

        if (isNaN(doubleValue)) {
            message.error('Invalid point value');
            setLoading(false);
            return;
        }

        rechargeUserPoint(doubleValue)
            .then((res) => {
                if (res === 1) {
                    message.success('充值成功');
                    fetchUserData();
                    setValue(0);
                } else {
                    message.error('充值失败');
                }
                setLoading(false);
            });
    };

    return (
        <Layout style={{ padding: '50px' }}>
            <div style={{ backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', width: '400px', margin: 'auto' }}>
                <Title level={3} style={{ textAlign: 'center' }}>充值</Title>
                <div style={{ marginBottom: '20px' }}>
                    <Text>账户余额: {userData.point}</Text>
                </div>

                <Form onFinish={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <Text>请选择充值金额</Text>
                        <InputNumber
                            style={{ width: '100%' }}
                            value={value}
                            onChange={handleChange}
                            placeholder="请输入金额"
                            min={0.1}
                            max={999999}
                        />
                    </div>

                    <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                        <Button type="default" onClick={() => setValue(10)}>10</Button>
                        <Button type="default" onClick={() => setValue(30)}>30</Button>
                        <Button type="default" onClick={() => setValue(50)}>50</Button>
                        <Button type="default" onClick={() => setValue(100)}>100</Button>
                        <Button type="default" onClick={() => setValue(200)}>200</Button>
                        <Button type="default" onClick={() => setValue(amount)}>自定义</Button>
                    </Space>

                    <div style={{ marginTop: '20px' }}>
                        <Button
                            type="primary"
                            block
                            htmlType="submit"
                        >
                            确定支付
                        </Button>
                    </div>

                    <div style={{ marginTop: '20px', fontSize: '12px' }}>
                        <Text type="secondary">
                            如遇充值高峰，到账可能延迟，请耐心等待，勿重复充值。如充值后超过两小时未到账，请联系我们123-456-789
                        </Text>
                    </div>
                </Form>
            </div>
        </Layout>
    );
};

export default UserRecharge;