import axiosInstance from './axiosInstance';

export const sendContactMessage = async (formData) => {
  try {
    const response = await axiosInstance.post('/contacts', formData);
    return response.data;
  } catch (error) {
    console.error('Contact form error:', error.response?.data || error.message);
    throw error;
  }
};
