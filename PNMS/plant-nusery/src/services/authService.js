import axios from './axiosInstance';
import { jwtDecode } from 'jwt-decode';

export const loginUser = async ({ email, password }) => {
  const response = await axios.post('/auth/login', { email, password });
  const { jwtToken, refreshToken } = response.data;

  // Store tokens
  localStorage.setItem('token', jwtToken);
  localStorage.setItem('refreshToken', refreshToken);

  // Decode the token to extract userId
  const { sub, role, userId } = jwtDecode(jwtToken);

  // ✅ Store userId as well
  if (userId) {
    localStorage.setItem('userId', userId.toString());
  }

  return jwtToken;
};

export const registerUser = async (formData) => {
  return await axios.post('/auth/register', formData);
};

export const refreshToken = async () => {
  const token = localStorage.getItem('refreshToken');
  return await axios.post('/auth/refresh-token', { refreshToken: token });
};

export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userId');
};
