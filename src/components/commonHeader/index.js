import React from "react";
import { Button, Avatar, Layout, Dropdown, message, Typography, Col, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import './commonHeader.css';
const { Text } = Typography;

const { Header } = Layout;

const avatar = () => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
        const user = JSON.parse(storedUserData);

        return user.avatar;
    }
};

const getUsername = () => {
    const storedUserData = localStorage.getItem("user");
    if(storedUserData){
        const user = JSON.parse(storedUserData);

        return user.nickName
    }
}

const CommonHeader = () => {
    const navigate = useNavigate(); 

    const logout = () => {
        localStorage.clear();
        message.success("退出成功");
        window.location.reload(); // 强制刷新，确保状态更新

        navigate("/login");
    }

    const items = [
        {
            key: '1',
            label: (
                <a onClick={logout} target="_blank" rel="noopener noreferrer">
                    退出
                </a>
            )
        }
    ];

    return (
        <Header className="header-container">
            <Row justify="end" align="middle" style={{ width: '100%' }}>
                {/* 用户名称 */}
                <Col>
                    <Text style={{ marginRight: 20, fontSize: 16, fontWeight: 'bold' }}>
                        {getUsername()}
                    </Text>
                </Col>
                
                {/* 头像 */}
                <Col>
                    <Dropdown menu={{ items }}>
                        <Avatar
                            size={42}
                            className="header-avatar"
                            src={<img src={avatar()} alt="user" />}
                        />
                    </Dropdown>
                </Col>
            </Row>
        </Header>
    );
}

export default CommonHeader;
