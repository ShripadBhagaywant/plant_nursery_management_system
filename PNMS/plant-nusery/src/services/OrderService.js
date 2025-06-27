import axiosInstance from './axiosInstance';

export const orderService ={

    placeOrder: (orderData) => axiosInstance.post('/orders', orderData),

    getOrderById: (id) => axiosInstance.get(`/orders/${id}`),

    getOrdersByUser: (userId) => axiosInstance.get(`/orders/user/${userId}`),

    cancelOrder: (orderId) => axiosInstance.put(`/orders/cancel/${orderId}`),

    updateOrder: (orderId, data) => axiosInstance.put(`/orders/update/${orderId}`, data),

    deleteOrder: (orderId) => axiosInstance.delete(`/orders/${orderId}`)
};
    



