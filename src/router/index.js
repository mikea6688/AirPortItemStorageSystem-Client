import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
import Login from '../pages/login';
import Register from '../pages/register';
import Main from '../pages/main';
import UserInfo from '../pages/User/userInfo';
import UserPassword from '../pages/User/userPassword';
import UserRecharge from '../pages/User/userRecharge';
import Storage from '../pages/ItemStorage/Storage';
import StorageOrder from '../pages/ItemStorage/StorageOrder';
import LogisticsInfo from '../pages/ItemTake/logisticsInfo';
import Order from '../pages/ItemTake/order';
import UserComment from '../pages/userComment';
import Home from '../pages/Home';
import PaymentPage from '../pages/ItemTake/payment';
import Delivery from '../pages/ItemTake/delivery';
import Discard from '../pages/ItemTake/discard';
import UserPayPassword from '../pages/User/userPayPassword';

// 保护路由组件
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    console.log("拿到的token：" + token);
    // 如果没有 token，则跳转到登录页
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

const routes = [
    {
        path: '/login',
        element: <Login />,
    },
    {
        path: '/register',
        element: <Register />,
    },
    {
        path: '/',
        element: <Navigate to="/login" replace />, // 默认跳转到登录页
    },
    {
        path: '/main',
        element: <Main />,
        children: [
            //首页
            {
                path: 'home',
                element: <ProtectedRoute><Home /></ProtectedRoute>
            },
            // 个人信息管理
            {
                path: 'user', // 这里是相对路径，不是绝对路径
                element: <ProtectedRoute><Outlet /></ProtectedRoute>, // 使用Outlet来渲染子路由
                children: [
                    {
                        path: 'info',
                        element: <ProtectedRoute><UserInfo /></ProtectedRoute>
                    },
                    {
                        path: 'password',
                        element: <ProtectedRoute><UserPassword /></ProtectedRoute>
                    },
                    {
                        path: 'payPassword',
                        element: <ProtectedRoute><UserPayPassword /></ProtectedRoute>
                    },
                    {
                        path: 'recharge',
                        element: <ProtectedRoute><UserRecharge /></ProtectedRoute>
                    }
                ]
            },
            // 存储物品管理
            {
                path: 'itemStorage',
                element: <ProtectedRoute><Outlet /></ProtectedRoute>,
                children: [
                    {
                        path: 'storage',
                        element: <ProtectedRoute><Storage /></ProtectedRoute>,
                    },
                    {
                        path: 'storageOrder',
                        element: <ProtectedRoute><StorageOrder /></ProtectedRoute>,
                    },
                ],
            },
            // 取出物品管理
            {
                path: 'itemTake',
                element: <ProtectedRoute><Outlet /></ProtectedRoute>,
                children: [
                    {
                        path: 'logisticsInfo',
                        element: <ProtectedRoute><LogisticsInfo /></ProtectedRoute>,
                    },
                    {
                        path: 'orderList',
                        element: <ProtectedRoute><Order /></ProtectedRoute>,
                    },
                ],
            },
            // 意见反馈
            {
                path: 'userComment',
                element: <ProtectedRoute><UserComment /></ProtectedRoute>,
            },
            {
                path: 'payment',
                element: <ProtectedRoute><PaymentPage /></ProtectedRoute>,
            },
            {
                path: 'delivery',
                element: <ProtectedRoute><Delivery /></ProtectedRoute>,
            },
            {
                path: 'discard',
                element: <ProtectedRoute><Discard /></ProtectedRoute>,
            }
        ],
    },
    {
        path: '*',
        element: <Navigate to="/login" replace />,
    },
];

export default createBrowserRouter(routes);
