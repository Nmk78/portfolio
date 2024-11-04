import { Loader } from "lucide-react";
import React from "react";

const Loading = () => {
  return (
    <div className="flex justify-center animate-spin items-center h-full">
        <Loader color="#DC2626" size={40}/>
    </div>
  );
};

export default Loading;
