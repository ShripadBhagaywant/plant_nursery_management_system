import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import InfoCard from "../components/InfoCard";
import { Plant, List, Archive } from "@phosphor-icons/react";
import heroBg from "../assets/gptPN.jpg";
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const Home = () => { 
   const navigate = useNavigate();
  return (
    <div>
      <Navbar />

  {/* Hero Section */}
    <section className="relative h-[80vh] w-full pt-16 overflow-hidden">
    {/* Background Image */}
    <div
      className="absolute inset-0 bg-center bg-cover"
      style={{ backgroundImage: `url(${heroBg})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" />
    </div>

    {/* Centered Content */}
    <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-8">
      <h1 className="text-white text-4xl sm:text-5xl font-Semibold font-poppins leading-tight drop-shadow-md mb-4">
        Plant Nursery <br /> Management System
      </h1>
      <p className="text-white text-lg sm:text-xl mb-6 max-w-2xl drop-shadow font-poppins">
        An application to manage plants, orders, and inventory efficiently.
      </p>
     <div className="flex flex-col sm:flex-row gap-12">
    <button onClick={() => navigate("/plants")} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition font-poppins">
      View Plants
    </button>
    <button   onClick={() => navigate("/about")} className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md shadow-md transition font-poppins">
      Learn More
    </button>
  </div>
    </div>
    </section>


    {/* Info Cards */}
    <section className="flex flex-col sm:flex-row justify-center items-center gap-6 p-10 bg-gray-50">
      <InfoCard
        icon={<Plant size={60} weight="bold" />}
        title="Our Plants"
        description="Browse and manage a variety of plants available at the nursery."
      />
      <InfoCard
          icon={<List size={60} weight="bold" />}
          title="Manage Orders"
          description="Track and process customer orders efficiently and accurately."
        />
        <InfoCard
          icon={<Archive size={60} weight="bold" />}
          title="Inventory Control"
          description="Monitor and update stock levels of all plants in the manage effectively."
        />
      </section>
    </div>
  );
};

export default Home;
