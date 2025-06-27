import React from "react";
import Navbar from "../components/Navbar";
import aboutImg from "../assets/about.jpg"; // Main left image
import smallPlantImg from "../assets/favicon.png"; // Small top-right image in text boxes

const About = () => {
  return (
    <div>
      <Navbar />

      <div className="pt-24 px-6 sm:px-12 font-poppins">
        <div className="flex flex-col md:flex-row gap-10">

          {/* Left: Main Image */}
          <div className="w-full md:w-1/2 flex justify-center items-start">
            <img
              src={aboutImg}
              alt="Main Nursery"
              className="w-[6000px] h-[600px] max-w-md  rounded-2xl shadow-2xl border border-gray-500 hover:shadow-xl transition cursor-pointer"
            />
          </div>

          {/* Right: Two Text Boxes */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">

            {/* First Box */}
            <div className="relative bg-white p-6 rounded-xl shadow-lg text-gray-800 hover:shadow-xl transition cursor-pointer">
              {/* Small circle image top-right */}
              <img
                src={smallPlantImg}
                alt="Detail"
                className="w-16 h-16 rounded-full border-4 border-gray-200 shadow-md absolute top-1 right-4 hover:shadow-xl transition cursor-pointer"
              />
              <p className="mb-4 text-green-500 font-bold text-xl">
                Plant Management 🌿
              </p>
             <p className=" text-[16px] leading-relaxed text-gray-800">
                Simplify your nursery operations with smart tools for managing <span className="text-green-600 font-medium">inventory</span> and <span className="text-green-600 font-medium">orders</span>.  
                Our system is designed to give plant nursery owners full control over their daily tasks, ensuring that everything from stock levels to customer requests is handled efficiently.  
                <span className="text-green-600 font-medium">With real-time tracking, organized plant catalogs, and automated processes, you can focus more on growing your business and building customer trust.</span>  
                Whether you're managing a small home-based nursery or a large commercial setup, our platform is tailored to meet your needs and help your green business flourish.
                justify our service with a user-friendly interface and powerful features, we aim to make your nursery management experience as seamless as possible.
              </p>
            </div>

            {/* Second Box */}
            <div className="relative bg-white p-6 rounded-xl shadow-2xl text-gray-800 hover:shadow-xl transition cursor-pointer">
              {/* Small circle image top-right */}
              <img
                src={smallPlantImg}
                alt="Detail"
                className="w-16 h-16 rounded-full border-4 border-gray-200 shadow-md absolute top-1 right-4 hover:shadow-xl transition cursor-pointer"
              />
              <p className="mb-4 text-green-500 font-bold text-xl">
                Catalog & Grow 🍂
              </p>
              <p className=" text-[15px] leading-relaxed text-gray-800">
                Organize your plant data, streamline <span className="text-green-600 font-medium">customer experience</span>, and boost your business with ease.
                Our platform offers intuitive tools to manage every detail—from tracking plant varieties and growth cycles to <span className="text-green-600 font-medium">maintaining customer records and order histories</span>.
                By centralizing your nursery’s operations, you reduce manual workload and improve accuracy.
                With a <span className="text-green-600 font-medium">smooth</span> user interface and real-time updates, you can deliver a personalized, efficient, and delightful shopping experience to every customer.
                One to one support and comprehensive resources i have.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
