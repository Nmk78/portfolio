import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center items-center h-96">
        <Loader color="#956BEB" size={40}/>
    </div>
  );
};

export default Loading;
