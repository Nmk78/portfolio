"use client"
import ProjectShowcase from "@/components/ProjectsShowcase";
import { useEdgeStore } from "@/lib/edgestore";
import { Project } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";

const page = () => {


  const { edgestore } = useEdgeStore();

  const [projects, setProjects] = useState<Project[]>([]); // For API data

  const fetchProjects = async () => {
    const { data } = await axios.get("/api/projects");
    setProjects(data?.data)
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
  return <ProjectShowcase projects={projects} />;
};

export default page;
