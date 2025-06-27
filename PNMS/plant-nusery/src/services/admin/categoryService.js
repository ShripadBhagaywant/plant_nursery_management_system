import axios from "../../services/axiosInstance";

const BASE = "/categories";

export const createCategory = (data) => axios.post(`${BASE}`, data);

export const updateCategory = (id, data) => axios.put(`${BASE}/${id}`, data);

export const deleteCategory = (id) => axios.delete(`${BASE}/${id}`);

export const getCategoryById = (id) => axios.get(`${BASE}/${id}`);

export const getAllCategories = () => axios.get(`${BASE}`);

export const searchCategories = (keyword = "", page = 0, size = 6) =>
  axios.get(`${BASE}/search?keyword=${keyword}&page=${page}&size=${size}`);
