import React, { useState } from "react";
import { Form, Input, message, Button, Checkbox, Space, Typography, Row, Col } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { operateUserOrder } from "../../api";

const { Title } = Typography;

function Delivery() {
  const [form] = Form.useForm();
  const [agree, setAgree] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const source = queryParams.get('source');

  const handleSubmit = (values) => {
    const { recipientName, phoneNumber, shippingAddress, paymentMethod } = values;
    const orderId = queryParams.get('orderId');
    try {
      operateUserOrder({
        orderId: orderId,
        operateType: 'Delivery',
        userOrderLogistics: {
          orderId: orderId,
          recipient: recipientName,
          phone: phoneNumber,
          deliveryAddress: shippingAddress,
          paymentMethod: paymentMethod
        }
      });
      message.success("操作成功");
    } catch (error) {
      message.error("操作失败");
    }
    navigate('/main/itemTake/orderList')
        
    console.log("表单提交的数据：", values);
  };

  return (
    <div style={{ background: "#f5f5f5", padding: "40px 0" }}>
      <Row justify="center">
        <Col xs={24} sm={20} md={16} lg={12}>
          <div style={{ background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)" }}>
            <Title level={3} style={{ textAlign: "center" }}>填写快递信息</Title>
            <Form form={form} onFinish={handleSubmit} layout="vertical">
              {/* 收件人姓名 */}
              <Form.Item
                label="收件人"
                name="recipientName"
                rules={[{ required: true, message: "请输入收件人姓名" }]}
              >
                <Input placeholder="请输入收件人姓名" />
              </Form.Item>

              {/* 手机号码 */}
              <Form.Item
                label="手机号码"
                name="phoneNumber"
                rules={[{ required: true, message: "请输入手机号码" }, { pattern: /^[0-9]{11}$/, message: "请输入有效的手机号码" }]}
              >
                <Input placeholder="请输入手机号码" />
              </Form.Item>

              {/* 收货地址 */}
              <Form.Item
                label="收货地址"
                name="shippingAddress"
                rules={[{ required: true, message: "请输入收货地址" }]}
              >
                <Input.TextArea placeholder="请输入收货地址" rows={4} />
              </Form.Item>

              {/* 付款方式 */}
              <Form.Item
                label="付款方式"
                name="paymentMethod"
                initialValue="PaymentOnArrival"
                rules={[{ required: true, message: "请选择付款方式" }]}
              >
                <Input placeholder="到付" disabled />
              </Form.Item>

              {/* 协议勾选框 */}
              <Form.Item
                name="agreement"
                valuePropName="checked"
                rules={[
                  {
                    validator: (_, value) => value ? Promise.resolve() : Promise.reject(new Error("请阅读并同意电子运单条款")),
                  },
                ]}
              >
                <Checkbox onChange={(e) => setAgree(e.target.checked)}>
                  阅读并同意（电子运单条款）
                </Checkbox>
              </Form.Item>

              {/* 确认按钮 */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  disabled={!agree}  // 只有勾选协议才启用提交按钮
                >
                  确定
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default Delivery;
