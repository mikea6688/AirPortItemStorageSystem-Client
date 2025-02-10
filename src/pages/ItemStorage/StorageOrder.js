import React, { useState, useEffect } from 'react';
import { Layout, Input, Button, Select, message, Table, Typography, Space, Tag, Form } from 'antd';
import './style/storageOrder.css';
import { getOrderList } from '../../api';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const { Title, Text } = Typography;
const { Option } = Select;


const StorageOrder = () => {
  const [form] = Form.useForm();
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [orderQuery, setOrderQuery] = useState('');
  const [statusQuery, setStatusQuery] = useState('');

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchOrderData = () => {
    setLoading(true);
    console.log(orderQuery, statusQuery);

    getOrderList({
      num: orderQuery,
      status: statusQuery,
      pageIndex: pagination.current,
      pageSize: pagination.pageSize
    })
      .then((res) => {
        if (res && Array.isArray(res.orders)) {
          setOrderData(res.orders.map(order => ({ ...order, key: order.id })));
          setPagination({
            ...pagination,
            total: res.total,
          });
        }
      })
      .catch(() => {
        message.error('获取订单数据失败');
      })
    setLoading(false);
  };

  // init
  useEffect(() => {
    fetchOrderData();
  }, []);

  const handleOrderQueryChange = (e) => {
    setOrderQuery(e.target.value);
  };

  const handleStatusQueryChange = (e) => {
    setStatusQuery(e);
  };

  const filteredOrders = orderData.filter(
    (order) =>
      (order.num.includes(orderQuery) || orderQuery === '') &&
      (order.status.includes(statusQuery) || statusQuery === '')
  );

  // 处理查询
  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchOrderData();
  };

  // 状态映射表
  const statusMap = {
    Using: { text: "存储中", color: "blue" },
    TakenOut: { text: "已取出", color: "green" },
    Discarded: { text: "已废弃", color: "red" },
    SentForExpressDelivery: { text: "已寄件", color: "orange" },
  };

  const columns = [
    {
      title: '柜子编号',
      dataIndex: 'num',
      key: 'num',
    },
    {
      title: '存储时间',
      dataIndex: 'storageDate',
      key: 'storageDate',
    },
    {
      title: '已存时间',
      dataIndex: 'storedDuration',
      key: 'storedDuration',
      render: (seconds) => {
        const d = dayjs.duration(seconds, "seconds");
        return `${d.days()}天 ${d.hours()}小时 ${d.minutes()}分钟`;
      }
    },
    {
      title: '暂存凭证',
      dataIndex: 'voucherNumber',
      key: 'voucherNumber',
      render: (text, record) => {
        const isExtracted = record.status !== 'Using';
        return (
          <Text
            className={isExtracted ? 'voucher-text-extracted' : ''}
          >
            {text}
          </Text>
        );
      },
    },
    {
      title: '花费',
      dataIndex: 'storagePrice',
      key: 'storagePrice',
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = statusMap[status] || { text: "未知状态", color: "gray" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
  ];

  return (
    <Layout className="order-info-page">
      <Layout.Content style={{ padding: '50px 20px' }}>
        <div className="order-info-container">
          {/* Top Search Section */}
          <div className="search-section">
            <Space>
              <Input
                className="search-input"
                placeholder="输入订单编号查询"
                value={orderQuery}
                onChange={handleOrderQueryChange}
              />
              <Select
                className="search-input"
                placeholder="选择订单状态查询"
                value={statusQuery}
                onChange={handleStatusQueryChange}
                style={{ width: 120 }}
                allowClear
              >
                <Option value="">所有类型</Option>
                <Option value="Using">使用中</Option>
                <Option value="TakenOut">已取出</Option>
                <Option value="Discarded">已废弃</Option>
                <Option value="SentForExpressDelivery">已寄件</Option>
              </Select>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
            </Space>
          </div>

          {/* Orders Table */}
          <Table
            columns={columns}
            dataSource={filteredOrders}
            pagination={false}
            rowKey="key"
            className="table-container"
          />
        </div>
      </Layout.Content>
    </Layout>
  );
};

export default StorageOrder;