import axiosInstance from "../axiosInstance";

// Get paginated inventory
export const getPaginatedInventory = (page, search) =>
  axiosInstance.get("/inventory/paginated", { params: { page, search } });

// Get low stock items
export const getLowStock = (threshold) =>
  axiosInstance.get("/inventory/low-stock", { params: { threshold } });

// Update inventory quantity (replaces value)
export const updateInventory = (plantId, quantity) =>
  axiosInstance.post("/inventory/update", { plantId, quantity });

// Increase quantity
export const addInventoryQuantity = (plantId, quantity) =>
  axiosInstance.put(`/inventory/${plantId}/add`, null, {
    params: { quantity },
  });

// Decrease quantity
export const reduceInventoryQuantity = (plantId, quantity) =>
  axiosInstance.put(`/inventory/${plantId}/reduce`, null, {
    params: { quantity },
  });

  export const getAvailablePlantsForInventory = () =>
  axiosInstance.get("/inventory/available-plants");

export const addInventoryForNewPlant = (plantId, quantity) =>
  axiosInstance.post("/inventory/new", { plantId, quantity });

