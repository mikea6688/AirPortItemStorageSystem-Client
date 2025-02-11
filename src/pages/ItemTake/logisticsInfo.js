import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Switch, message, Space } from 'antd';
import { useNavigate, useLocation } from "react-router-dom";
import { getLogisticsInfo } from '../../api';

const LogisticsInfo = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // 状态映射表
  const statusMap = {
    Pending: { text: "待处理", color: "orange" },
    InTransit: { text: "配送中", color: "blue" },
    Arrived: { text: "已送达", color: "green" },
    Discarded: { text: "已废弃", color: "red" },
  };

  // 初始化物流信息列表
  const [logisticsData, setLogisticsData] = useState([]);

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchOrderData = () => {
    setLoading(true);
    getLogisticsInfo({
      pageIndex: pagination.current,
      pageSize: pagination.pageSize
    })
      .then((res) => {
        if (res && Array.isArray(res.logisticsInfo)) {
          setLogisticsData(res.logisticsInfo.map(x => ({ ...x, key: x.id })));
          setPagination({
            ...pagination,
            total: res.total,
          });
        }
      })
      .catch(() => {
        message.error('获取物流信息失败，请稍后重试.');
      })
    setLoading(false);
  };

  useEffect(() => {
    fetchOrderData();
  }, []);

  // 丢弃操作
  const handleDiscard = (key) => {
    setLogisticsData(logisticsData.filter(item => item.key !== key));
    navigate('/main/discard?source=logistics')
  };

  // 表格列定义
  const columns = [
    {
      title: '柜子编号',
      dataIndex: 'storageCabinetNumber',
      key: 'storageCabinetNumber',
    },
    {
      title: '支付金额',
      dataIndex: 'paymentAmount',
      key: 'paymentAmount',
    },
    {
      title: '存入时间',
      dataIndex: 'storageTime',
      key: 'storageTime',
    },
    {
      title: '是否取出',
      dataIndex: 'isTakenOut',
      key: 'isTakenOut',
      render: (text) => (
        <Switch
          checked={text}
          disabled
          checkedChildren="已取出"
          unCheckedChildren="未取出"
        />
      ),
    },
    {
      title: '物流状态',
      dataIndex: 'logisticsStatus',
      key: 'logisticsStatus',
      render: (status) => {
        const statusInfo = statusMap[status] || { text: "未知状态", color: "gray" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            disabled={record.logisticsStatus!=='InTransit' || record.logisticsStatus!=='Pending'}
            type="primary" danger
            onClick={() => handleDiscard(record.key)}
          >
            丢弃
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      <Table
        columns={columns}
        dataSource={logisticsData}
        pagination={false}
        rowKey="key"
      />
    </div>
  );
};

export default LogisticsInfo;