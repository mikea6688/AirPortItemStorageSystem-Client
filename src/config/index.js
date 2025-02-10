export default [
    {
        path: '/main/home',
        name: 'home',
        label: '首页',
        icon: 'BankOutlined',
        url: '/home/index'
    },
    {
        path: '/main/user',
        label: '个人信息管理',
        icon: 'UserOutlined',
        children:[
            {
                path: '/main/user/info',
                name: 'list',
                label: '个人信息',
                icon: 'UserOutlined',
            },
            {
                path: '/main/user/password',
                name: 'password',
                label: '登录密码修改',
                icon: 'AppstoreOutlined',
            },
            {
                path: '/main/user/payPassword',
                name: 'payPassword',
                label: '支付密码修改',
                icon: 'AppstoreOutlined',
            },
            {
                path: '/main/user/recharge',
                name: 'recharge',
                label: '充值',
                icon: 'AppstoreOutlined',
            }
        ]
    },
    {
        path: '/main/itemStorage',
        label: '存储物品管理',
        icon: 'AppstoreOutlined',
        children:[
            {
                path: '/main/itemStorage/storage',
                name: 'itemStorage',
                label: '存储物品',
                icon: 'AppstoreOutlined',
            },
            {
                path: '/main/itemStorage/storageOrder',
                name: 'itemStorageOrder',
                label: '订单查询',
                icon: 'AppstoreOutlined',
            }
        ]
    },
    {
        path: '/main/itemTake',
        label: '取出物品管理',
        icon: 'MoneyCollectOutlined',
        children:[
            {
                path: '/main/itemTake/orderList',
                name: 'orderList',
                label: '订单信息',
                icon: 'AppstoreOutlined',
            },
            {
                path: '/main/itemTake/logisticsInfo',
                name: 'logisticsInfo',
                label: '快递物流信息',
                icon: 'AppstoreOutlined',
            }
        ]
    },
    {
        path: '/main/userComment',
        name: 'userComment',
        label: '意见反馈',
        icon: 'MessageOutlined',
        url: '/userComment/index'
    }
]