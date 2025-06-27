import axiosInstance from "./axiosInstance";

const BASE_URL = "/cart";

export const cartService = {
  getCart: (userId) => axiosInstance.get(`${BASE_URL}/${userId}`),

  addToCart: (userId, cartItem) =>
    axiosInstance.post(`${BASE_URL}/${userId}/add`, cartItem),

  updateQuantity: (userId, cartItem) =>
    axiosInstance.put(`${BASE_URL}/${userId}/update`, cartItem),

  removeFromCart: (userId, plantId) =>
    axiosInstance.delete(`${BASE_URL}/${userId}/remove/${plantId}`),

  clearCart: (userId) => axiosInstance.delete(`${BASE_URL}/${userId}/clear`),

  deleteCart: (userId) => axiosInstance.delete(`${BASE_URL}/${userId}`),
};
