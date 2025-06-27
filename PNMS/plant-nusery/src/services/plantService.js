import axiosInstance from "./axiosInstance";


const getPlants = (category, page = 0, size = 6, sortBy = "name", keyword = "") => {
  
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("size", size);
  params.append("sortBy", sortBy);
  params.append("keyword", keyword);
  params.append("category", category || "ALL");

 
 return axiosInstance.get(`/plants?${params.toString()}`);
};



export default {
  getPlants,
};
