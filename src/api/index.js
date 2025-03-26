import { data } from '@remix-run/router';
import dayjs from 'dayjs';
import http from './axios'

const getUserId = () => {
    const storedUserData = localStorage.getItem("user");
    if (storedUserData) {
        const user = JSON.parse(storedUserData);
        return user.id
    }
};

//#region 用户相关api

export const getCurrentUser = (id) => {
    return http.get(`/user/${id}`);
  };
  

export const updateUser = (data) => {
    return http.post('/user/update', data,
        {
            headers: {
                'userId': getUserId(), // 将 userId 加入请求头
            }
        }
    );
};

export const loginUser = (data) =>{
    return http.post('/user/login', data)
}

export const registerUser = (data) =>{
    return http.post('/user/register', data)
}

export const updateUserLoginPassword = (data) =>{
    return http.post('/user/loginPassword/update', data,
        {
            headers: {
                'userId': getUserId(),
            }
        }
    )
}

export const updateUserPayPassword = (data) =>{
    return http.post('/user/payPassword/update', data,
        {
            headers: {
                'userId': getUserId(),
            }
        }
    )
}

export const rechargeUserPoint = (data) =>{
    return http.post('/user/recharge', data,
        {
            headers: {
                'userId': getUserId(),
            }
        }
    )
}

export const checkUserOrderVoucher = (data) =>{
    return http.post('/user/voucher/check', data,
        {
            headers: {
                'userId': getUserId(),
            }
        }
    )
}

//#endregion

//#region 用户评论api
export const createUserComment = (data) =>{
    return http.post('/user/comment/add', data)
}
//#endregion

//#region 存储物品api

export const getStorageCabinetSettingList = () =>{
    return http.get('/storage/setting/get')
}

export const addOrder = (data) =>{
    return http.post('/order/add', data,
        {
            headers: {
                'userId': getUserId(),
            }
        }
    )
}

export const getOrderList = (data) =>{
    return http.get('/order/listByUserId', data,
        {
            headers: {
                'userId': getUserId(),
            }
        }
    )
}

//#endregion

//#region 公告api

export const getNotificationList = (data) => {
    return http.get('/notification/list', data, {
        headers: {
            'userId': getUserId(), // 将 userId 加入请求头
        }
    })
}

//#endregion

//#region 订单api

export const operateUserOrder = (data) => {
    return http.post('/storage/operate', data, {
        headers: {
            'userId': getUserId(),
        }
    })
}

export const paymentOrder = (data) => {
    return http.post('/order/payment', data, {
        headers: {
            'userId': getUserId(),
        }
    })
}

export const getLogisticsInfo = (data) =>{
    return http.get('/order/logistics/list', data,{
        headers: {
            'userId': getUserId(),
        }
    })
}

//#endregion

export const getAllStorageCategories = (data) => {
    return http.get('/storage/category/list', data, {
        headers: {
            'userId': getUserId()
        }
    })
}

export const renewalUserOrder = (data) =>{
    return http.post('/order/renewal', data,{
        headers: {
            'userId': getUserId(),
        }
    })
}