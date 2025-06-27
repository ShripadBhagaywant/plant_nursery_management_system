import axiosInstance from "../axiosInstance";

export const getRecentPayments = () => axiosInstance.get("/payments/recent");

export const getAllPayments = (page = 0, size = 10) =>
  axiosInstance.get(`/payments/all?page=${page}&size=${size}`);

export const getPaymentsByStatus = (status, page = 0, size = 10) =>
  axiosInstance.get(`/payments/status/${status}?page=${page}&size=${size}`);
