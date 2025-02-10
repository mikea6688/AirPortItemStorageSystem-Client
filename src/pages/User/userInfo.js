import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Avatar, Col, Row, Typography, message, Select, Upload } from 'antd';
import './style/userInfo.css';
import { getCurrentUser, updateUser } from '../../api';

const { Title } = Typography;

const UserInfo = () => {
    const [form] = Form.useForm();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newAvatar, setNewAvatar] = useState(null);
    const [userId, setUserId] = useState(null);

    // 获取当前登录用户的 ID
    useEffect(() => {
        const storedUserData = localStorage.getItem("user");
        if (storedUserData) {
            const user = JSON.parse(storedUserData);
            setUserId(user.id);
        }
    }, []);

    // 获取用户数据
    useEffect(() => {
        if (!userId) return;
        setLoading(true);

        getCurrentUser(userId)
            .then((res) => {
                if (res) {
                    setUserData(res);
                    form.setFieldsValue(res);
                    setNewAvatar(res.avatar); // 设置默认头像
                } else {
                    message.error("返回数据格式不正确");
                }
            })
            .catch(() => {
                message.error("获取用户数据失败");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [userId, form]); // `userId` 变化时重新加载

    // 处理表单数据变化
    const handleChange = (field, value) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    // 更新用户信息
    const handleSave = () => {
        form.validateFields().then((values) => {
            if (!userData || !userId) {
                message.error("用户信息错误，请重新登录");
                return;
            }

            const updateData = {
                userId: userId,
                nickName: values.nickName,
                phone: values.phone,
                email: values.email,
                address: values.address,
                avatar: newAvatar,
            };

            updateUser(updateData)
                .then((res) => {
                    if (res === 1) {
                        message.success('更新成功');
                        setUserData(updateData);
                    } else {
                        message.error('更新失败');
                    }
                })
                .catch(() => {
                    message.error('更新失败');
                });
        });
    };

    // 处理头像上传
    const handleUpload = (info) => {
        if (info.file.status === 'done') {
            setNewAvatar(info.file.response);
            message.success('头像上传成功');
        } else if (info.file.status === 'error') {
            message.error('上传头像失败');
        }
    };

    if (!userData) {
        return <div>加载中...</div>;
    }

    return (
        <div className="personal-info-container">
            <Card className="info-card" loading={loading}>
                <Row gutter={32}>
                    <Col span={8} className="avatar-column" style={{ position: 'relative' }}>
                        <Upload
                            name="file"
                            showUploadList={false}
                            action={`http://localhost:8080/api/upload/avatar/${userId}`}
                            beforeUpload={(file) => {
                                const isImage = file.type.startsWith('image/');
                                if (!isImage) {
                                    message.error('只能上传图片!');
                                }
                                return isImage;
                            }}
                            onChange={handleUpload}
                        >
                            <Avatar size={100} src={newAvatar || userData.avatar} />
                        </Upload>
                        <Title level={3} className="username">
                            {userData.nickName}
                        </Title>
                    </Col>
                    <Col span={16}>
                        <Form layout="vertical" form={form} className="form-container">
                            <Form.Item label="账号" name="accountName" className="form-item">
                                <Input value={userData.accountName} disabled className="readonly-input" />
                            </Form.Item>

                            <Form.Item label="角色" name="roleType" className="form-item">
                                <Select value={userData.roleType} disabled className="readonly-input">
                                    <Select.Option value="Admin">管理员</Select.Option>
                                    <Select.Option value="VIP">VIP</Select.Option>
                                    <Select.Option value="Ordinary">普通用户</Select.Option>
                                </Select>
                            </Form.Item>

                            <Form.Item label="姓名" name="nickName" className="form-item">
                                <Input value={userData.nickName} onChange={(e) => handleChange('nickName', e.target.value)} />
                            </Form.Item>

                            <Form.Item label="账户余额" name="point" className="form-item">
                                <Input value={userData.point} disabled className="readonly-input" />
                            </Form.Item>

                            <Form.Item label="手机号码" name="phone" className="form-item">
                                <Input value={userData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                            </Form.Item>

                            <Form.Item label="Email" name="email" className="form-item">
                                <Input value={userData.email} onChange={(e) => handleChange('email', e.target.value)} />
                            </Form.Item>

                            <Form.Item label="快递地址" name="address" className="form-item">
                                <Input.TextArea
                                    value={userData.address}
                                    rows={2.5}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                />
                            </Form.Item>

                            <Form.Item className="save-button">
                                <Button type="primary" size="large" onClick={handleSave}>
                                    保存
                                </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default UserInfo;
