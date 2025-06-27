import axiosInstance from "../../services/axiosInstance";

export const fetchAllKycs = (page = 0, size = 10) =>
  axiosInstance.get(`/kyc?page=${page}&size=${size}`).then(res => res.data);

export const updateKycStatus = (kycId, status) =>
  axiosInstance.put(`/kyc/${kycId}/status`, null, {
    params: { status },
  }).then(res => res.data);

export const getKycByStatus = (status, page = 0, size = 10) =>
  axiosInstance.get(`/kyc/status?status=${status}&page=${page}&size=${size}`).then(res => res.data);
