import React, { useRef, useEffect, useState } from 'react';
import { Layout, Typography, Table, Card, List, message } from 'antd';
import { getNotificationList, getStorageCabinetSettingList } from '../../api';
import './index.css';

const airportName = "Solar机场";
const { Header, Content, Sider } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [settingList, setSettingList] = useState([]);

  const fetchData = () => {
    setLoading(true);
    getNotificationList({
      queryHasPublished: true
    })
    .then((res) => {
      if (res && Array.isArray(res.notifications)) {
        setNotifications(res.notifications.map(notification => ({ ...notification, key: notification.id })));
      }
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      message.error("获取公告数据失败");
    });

    setLoading(true);
    getStorageCabinetSettingList ()
    .then((res) => {
      if (res && Array.isArray(res.settingList)) {
        setSettingList(res.settingList.map(setting => ({ ...setting, key: setting.id })));
      }
      setLoading(false);
    })
    .catch((error) => {
      setLoading(false);
      message.error("获取柜子设置数据失败");
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 表格列定义
  const columns = [
    {
      title: "柜子类型",
      dataIndex: "sizeType",
      key: "sizeType",
      onCell: (_, index) => ({
        rowSpan: index % 3 === 0 ? 3 : 0, // 让每3行合并
      }),
      render: (text) => (text === "Small" ? "小" : text === "Medium" ? "中" : "大"),
    },
    {
      title: "柜子规模",
      dataIndex: "size",
      key: "size",
      onCell: (record, index) => ({
        rowSpan: index % 3 === 0 ? 3 : 0, // 让每3行合并
      }),
      render: (text, record) => `${record.length}x${record.width}x${record.height}cm`,
    },
    {
      title: "存放时间",
      dataIndex: "dateType",
      key: "dateType",
      render: (text) => (text === "ThreeDays" ? "三天" : text === "OneWeek" ? "一周" : "一个月"),
    },
    {
      title: "价格",
      dataIndex: "price",
      key: "price",
    },
  ];
  

  return (
    <Layout className="layout">
      <Header className="header">
        <Title level={1} style={{ color: 'white', margin: 0 }}>欢迎来到{airportName}</Title>
      </Header>
      <Layout className="main-layout">
        <Content className="content">
          <Card className="intro-card">
            <Title level={3}>机场介绍</Title>
            <img
              src={require("../../assets/images/airport.png")}
              alt="Airport"
              className="airport-image"
            />
            <Paragraph>
              {airportName}是一座现代化的国际机场，为旅客提供便捷的行李寄存服务。
              我们的智能储物柜系统全天24小时开放，位置便利，使用方便。
            </Paragraph>
          </Card>
          <Card className="price-card">
            <Title level={3}>柜子价格介绍</Title>
            <Table columns={columns} dataSource={settingList} pagination={false} bordered className="price-table" />
          </Card>
        </Content>
        <Sider
          width={400}
          className="sider"
          style={{ position: 'sticky', top: '20px', maxHeight: '90vh', overflowY: 'auto' }}
        >
          <Card className="sidebar-card" title={<Title level={3} className="announcement-title">公告</Title>}>
            <List
              itemLayout="vertical"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<strong>{item.title}</strong>}
                    description={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default Home;
