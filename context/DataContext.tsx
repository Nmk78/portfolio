"use client";

import React, { createContext } from "react";
import axios from "axios";
import { CV, PersonalInfo, Project, Skill } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";


// Fetch Functions
const fetchProjects = async () => {
  const { data } = await axios.get<{ data: Project[] }>("/api/projects");
  return data.data;
};

const fetchSkills = async () => {
  const { data } = await axios.get<{ data: Skill[] }>("/api/skills");
  return data.data;
};

const fetchPersonalInfo = async () => {
  const { data } = await axios.get<{ data: PersonalInfo }>("/api/info");
  return data.data;
};

const fetchCV = async () => {
  const { data } = await axios.get<{ data: CV }>("/api/cv");
  return data.data;
};

interface DataContextType {
  projects: Project[] | undefined;
  skills: Skill[] | undefined;
  cv: CV | undefined;
  personalInfo: PersonalInfo | undefined;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Fetch Projects
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // Fetch Skills
  const {
    data: skills,
    isLoading: skillsLoading,
    error: skillsError,
  } = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  // Fetch Skills
  const {
    data: cv,
    isLoading: cvLoading,
    error: cvError,
  } = useQuery({
    queryKey: ["cv"],
    queryFn: fetchCV,
  });

  // Fetch Personal Info
  const {
    data: personalInfo,
    isLoading: personalInfoLoading,
    error: personalInfoError,
  } = useQuery({
    queryKey: ["personalInfo"],
    queryFn: fetchPersonalInfo,
  });

  // Determine loading/error states
  const isLoading =
    projectsLoading || cvLoading || skillsLoading || personalInfoLoading;
  const error =
    projectsError || cvError || skillsError || personalInfoError
      ? "An error occurred while fetching data."
      : null;

  return (
    <DataContext.Provider
      value={{ projects, skills, cv, personalInfo, isLoading, error }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};
