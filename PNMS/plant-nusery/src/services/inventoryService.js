// src/services/inventoryService.js
import axiosInstance from './axiosInstance';

export const getUserInventory = async () => {
  return axiosInstance.get('/inventory'); // this should match your backend endpoint
};


export const getUserInventoryPagination = async (page, size, search) => {
  return axiosInstance.get('/inventory/paginated', {
    params: {
      page,
      size,
      search: search || '',
    },
  });
};