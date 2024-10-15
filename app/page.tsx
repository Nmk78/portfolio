import Graph from "@/components/Graph";
import Home from "@/components/Home";
import React from "react";

const page = () => {
  return (
    <>
      <Home />
      <div className="bg-gray-200">
        <Graph />
      </div>
    </>
  );
};

export default page;
