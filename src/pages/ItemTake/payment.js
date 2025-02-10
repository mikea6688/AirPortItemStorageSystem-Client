import React, { useState, useEffect } from "react";
import { Button, Card, Space, Typography, Row, Col, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { operateUserOrder, paymentOrder } from "../../api";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const { Text } = Typography;

function PaymentPage() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const queryParams = new URLSearchParams(location.search);
  const [totalPrice, setTotalPrice] = useState(0);
  const [source, setSource] = useState("");
  const [dayData, setDayData] = useState("");

  const handleCancel = () => {
    if (source === "logistics") {
      navigate('/main/itemTake/logisticsInfo')
    }
    else if (source === "order") {
      navigate('/main/itemTake/orderList')
    }
  };
  
  const getOrderInfo = () => {
    operateUserOrder({
      orderId: queryParams.get('orderId'),
      operateType: 'TakeOut'
    }).then((res) => {
      if (res) {
        const d = dayjs.duration(res.storageDuration, "seconds");
        setDayData(`${d.days()}天 ${d.hours()}小时`)
        setTotalPrice(res.totalPrice);
      }
    });
  }

  const handlePayment = () => {
    paymentOrder({
      orderId: queryParams.get('orderId')
    })
    .then((res)=>{
      if(res){
        message.info("支付成功！")
        if (source === "logistics") {
          navigate('/logisticsInfo')
        }
        else if (source === "order") {
          navigate('/main/itemTake/orderList')
        }
      }
    })
    .catch((error) =>{
      message.error(error.response.data.message)
    });
  };

  // init
  useEffect(() => {
    console.log(queryParams);
    setSource(queryParams.get('source'));

    getOrderInfo();
  }, []);

  return (
    <div style={{ background: "#f5f5f5", minHeight: "100vh", padding: "40px 0" }}>
      <Row justify="center">
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card
            bordered={false}
            style={{
              boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "center",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <Text style={{ fontSize: "18px", color: "#555" }}>
                您已存放时间为{" "}
                <Text strong style={{ fontSize: "20px", color: "#1890ff" }}>
                  {dayData}
                </Text>
                ，请支付所需费用为{" "}
                <Text strong style={{ fontSize: "20px", color: "#1890ff" }}>
                  {totalPrice}
                </Text>
              </Text>
            </div>

            <div style={{ marginTop: "30px" }}>
              <Space size="large">
                <Button
                  type="default"
                  size="large"
                  style={{
                    borderRadius: "4px",
                    padding: "10px 30px",
                    fontSize: "16px",
                    top: "5px",
                    backgroundColor: "#f5f5f5",
                  }}
                  onClick={handleCancel}
                >
                  取消
                </Button>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    borderRadius: "4px",
                    padding: "10px 30px",
                    fontSize: "16px",
                    backgroundColor: "#1890ff",
                    borderColor: "#1890ff",
                  }}
                  onClick={handlePayment}
                >
                  确定支付
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default PaymentPage;
