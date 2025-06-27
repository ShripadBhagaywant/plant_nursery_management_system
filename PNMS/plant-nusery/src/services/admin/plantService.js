import axios from "../axiosInstance";

export const getAllPlants = ({ page, size, search }) => {
  return axios.get("/plants", {
    params: {
      page,
      size,
      sortBy: "name",
      keyword: search, 
    },
  });
};


export const addPlant = (formData) =>
  axios.post("/plants", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updatePlant = (id, formData) =>
  axios.put(`/plants/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deletePlant = (id) => axios.delete(`/plants/${id}`);

export const getPlantById = (id) => axios.get(`/plants/${id}`);

// For dropdown use only
export const getAllPlantsNames = () => axios.get("/plants/list");
