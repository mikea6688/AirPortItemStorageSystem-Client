import React, { useState } from 'react';
import { Input, Button, Form, Typography, message } from 'antd';
import { createUserComment } from '../../api';

const { Title } = Typography;

const getUserId = () => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
        const user = JSON.parse(storedUserData);
        return user.id;
    }
};

const id = getUserId();

const FeedbackPage = () => {
    const [form] = Form.useForm();

    const handleSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                const addData = {
                    userId: id,
                    comment: values.feedback,
                    contactInfo: values.contact,
                }
                createUserComment(addData)
                    .then((res) => {
                        if (res === 1)
                            message.success("提交成功");
                        else
                            message.error("提交失败");

                        form.resetFields();
                    })
                    .catch((error) => {
                        message.error("提交失败");
                    })
            })
            .catch((errorInfo) => {
                console.log('Validation Failed:', errorInfo);
            });
    };

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            {/* Title */}
            <Title level={3}>请将您的意见和建议告诉我们吧！</Title>

            {/* Form */}
            <Form form={form} layout="vertical">
                {/* 意见和建议 */}
                <Form.Item
                    label="意见和建议"
                    name="feedback"
                    rules={[{ required: true, message: '请输入你的意见和建议!' }]}
                >
                    <Input.TextArea rows={4} placeholder="请输入你的意见和建议" />
                </Form.Item>

                {/* 联系方式 */}
                <Form.Item
                    label="联系方式"
                    name="contact"
                    rules={[{ required: true, message: '请输入你的联系方式!' }]}
                >
                    <Input placeholder="请输入你的联系方式" />
                </Form.Item>

                {/* 提交按钮 */}
                <div style={{ textAlign: 'center' }}>
                    <Button type="primary" onClick={handleSubmit}>
                        提交
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default FeedbackPage;
