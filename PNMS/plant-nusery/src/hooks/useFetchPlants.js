import { useEffect, useState } from "react";
import plantService from "../services/plantService";

// ✅ Map frontend category to backend enum values
const backendCategoryMap = {
  All: null,           
  Indoor: "INDOOR",
  Outdoor: "OUTDOOR",
  Flowering: "FLOWER",
  Herbal: "HERBAL",
  Decorative: "SUCCULENT", 
  Medical:"MEDICAL",
};

const useFetchPlants = (selectedCategory, currentPage, keyword = "") => {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const backendCategory = backendCategoryMap[selectedCategory];

        const { data } = await plantService.getPlants(
          backendCategory,                 // ✅ mapped category
          currentPage - 1,
          6,
          "name",
          keyword
        );

        setPlants(data.plants);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error("Error fetching plants", err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [selectedCategory, currentPage, keyword]);

  return { plants, loading, totalPages };
};

export default useFetchPlants;
