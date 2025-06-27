import axiosInstance from "../axiosInstance";

export const getAllOrders = async () => {
  return axiosInstance.get("/orders");
};

export const deleteOrder = async (id) => {
  return axiosInstance.delete(`/orders/${id}`);
};

export const updateOrder = async (id, updatedData) => {
  return axiosInstance.put(`/orders/status/${id}`, updatedData);
};
