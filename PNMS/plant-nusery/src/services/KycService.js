import axiosInstance from "../services/axiosInstance";


export const uploadKyc = async (documentType, frontImage, backImage) => {
  const formData = new FormData();
  formData.append('documentType', documentType);
  formData.append('frontImage', frontImage);
  formData.append('backImage', backImage);

  return axiosInstance.post('/kyc/upload', formData);
};


export const getMyKyc = async () => {
  const res = await axiosInstance.get('/kyc/me');
  return res.data;
};
