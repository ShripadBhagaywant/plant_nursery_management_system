import axiosInstance from '../axiosInstance';

export const fetchAllUsers = async () => {
  const res = await axiosInstance.get('/admin/users');
  return res.data;
};

export const blockUserById = async (userId) => {
  const res = await axiosInstance.put(`/admin/block/${userId}`);
  return res.data;
};

export const unblockUserById = async (userId) => {
  const res = await axiosInstance.put(`/admin/unblock/${userId}`);
  return res.data;
};
