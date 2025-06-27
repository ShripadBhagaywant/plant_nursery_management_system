import { useEffect, useState } from 'react';
import { getUserInventoryPagination } from '../services/inventoryService';

export const useUserInventory = ({ searchTerm, page }) => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const res = await getUserInventoryPagination(page - 1, 6, searchTerm);
      setInventory(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchInventory();
    }, 300); 
    return () => clearTimeout(delayDebounce);
  }, [searchTerm, page]);

  return {
    inventory,
    loading,
    totalPages,
    refetch: fetchInventory,
  };
};
