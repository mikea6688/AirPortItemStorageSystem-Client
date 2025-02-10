import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Input, Select, Space, Tag, message } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; // 引入useHistory钩子
import { checkUserOrderVoucher, getOrderList } from "../../api";
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

const { Option } = Select;

function OrderList() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [searchLockerId, setSearchLockerId] = useState(""); // 存储编号查询的值
  const [searchStatus, setSearchStatus] = useState(""); // 存储状态查询的值
  const [action, setSelectedAction] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userVoucher, setUserVoucher] = useState("");

  const navigate = useNavigate();
  
  const location = useLocation();
  const refreshKey = location.state?.refreshKey;

  // 分页参数
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0,
  });

  const fetchOrderData = () => {
      setLoading(true);
      getOrderList({
        num: searchLockerId,
        status: searchStatus,
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
    }, [refreshKey]);

  // 筛选数据
  const filteredOrders = orderData.filter(
    (order) =>
      (order.num.includes(searchLockerId) || searchLockerId === '') &&
      (order.status.includes(searchStatus) || searchStatus === '')
  );

  const statusMap = {
    Using: { text: "存储中", color: "blue" },
    TakenOut: { text: "已取出", color: "green" },
    SentForExpressDelivery: { text: "已寄件", color: "orange" },
    Discarded: { text: "已废弃", color: "red" }
  };

  const columns = [
    {
      title: "柜子编号",
      dataIndex: "num",
    },
    {
      title: "存储时间",
      dataIndex: "storageDate",
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
      title: "花费",
      dataIndex: "storagePrice",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusInfo = statusMap[status] || { text: "未知状态", color: "gray" };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      }
    },
    {
      title: "操作",
      render: (_, record) => (
        <Space>
          <Button
            type="primary" ghost
            disabled={record.status !== "Using"}
            onClick={() => handleOperation("取出", record)}
          >
            取出
          </Button>
          <Button
            type="primary"
            disabled={record.status !== "Using"}
            onClick={() => handleOperation("寄快递", record)}
          >
            寄快递
          </Button>
          <Button
            type="primary" danger
            disabled={record.status == "Discarded" || record.status == "TakenOut"}
            onClick={() => handleOperation("丢弃", record)}
          >
            丢弃
          </Button>
        </Space>
      ),
    },
  ];

  const handleOperation = (action, record) => {
    setSelectedRow(record);
    setSelectedAction(action);

    setIsModalVisible(true);
  };

  // 提交凭证逻辑
  const handleOk = () => {
    console.log("凭证信息已提交");
    checkUserOrderVoucher(userVoucher).then((res) => {
      if (res) {
        setIsModalVisible(false);
        if (action === "取出")
          navigate("/main/payment?source=order&orderId=" + selectedRow.id);
        if (action === "寄快递")
          navigate("/main/delivery?source=order&orderId=" + selectedRow.id);
        if (action === "丢弃")
          navigate("/main/discard?source=order&orderId=" + selectedRow.id);
      }
      else {
        message.error("输入凭证信息不正确");
      }
    }).catch((error) => {
      message.error("提交失败");
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // 处理查询
  const handleSearch = () => {
    setPagination((prev) => ({
      ...prev,
      current: 1,
    }));
    fetchOrderData();
  };

  return (
    <div>
      {/* 查询区域 */}
      <Space style={{ marginBottom: 20 }}>
        <Input
          placeholder="请输入柜子编号"
          value={searchLockerId}
          onChange={(e) => setSearchLockerId(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="选择状态"
          value={searchStatus}
          onChange={(value) => setSearchStatus(value)}
          style={{ width: 200 }}
        >
          <Option value="">所有</Option>
          <Option value="Using">存储中</Option>
          <Option value="TakenOut">已取出</Option>
          <Option value="Discarded">已丢弃</Option>
          <Option value="SentForExpressDelivery">已寄件</Option>
        </Select>
        <Button type="primary" onClick={handleSearch}>
          查询
        </Button>
      </Space>

      {/* 存储订单信息表格 */}
      <Table dataSource={filteredOrders} columns={columns} rowKey="key" />

      {/* 凭证输入弹窗 */}
      <Modal
        title="请输入凭证"
        open ={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input 
        placeholder="请输入凭证号码" 
        onChange={(e) => setUserVoucher(e.target.value)}
        />
      </Modal>
    </div>
  );
}

export default OrderList;