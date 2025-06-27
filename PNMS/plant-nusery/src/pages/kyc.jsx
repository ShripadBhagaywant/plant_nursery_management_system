import React from "react";
import Navbar from "../components/Navbar";
import KycUploadForm from "../components/KycUploadFrom";

const KycUploadPage = () => {
  return (
    <>
      <Navbar />
      <div className="pt-28 min-h-screen bg-white px-4">
        <KycUploadForm />
      </div>
    </>
  );
};

export default KycUploadPage;
