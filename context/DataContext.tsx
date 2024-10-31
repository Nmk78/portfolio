

"use client";

// types.ts

// DataProvider.tsx
import React, { createContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Url } from 'url';
import { PersonalInfo, Project, Skill } from '@/lib/types';

interface DataContextType {
  projects: Project[];
  skills: Skill[];
  personalInfo: PersonalInfo;
  loading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({} as PersonalInfo); // Specify type
const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectsResponse, skillsResponse, personalInfoResponse] = await Promise.all([
        axios.get<{ data: Project[] }>('http://localhost:3000/api/projects'),
        axios.get<{ data: Skill[] }>('http://localhost:3000/api/skills'),
        axios.get<{data: PersonalInfo}>('http://localhost:3000/api/info'),
      ]);

      setProjects(projectsResponse.data.data);
      setSkills(skillsResponse.data.data);
      setPersonalInfo(personalInfoResponse.data.data);

      console.log("🚀 ~ Fetched Data: ", {
        projects: projectsResponse.data.data,
        skills: skillsResponse.data.data,
        personalInfo: personalInfoResponse.data.data,
      });
    } catch (err) {
      setError("An error occurred");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Log updated state only after fetching data
  useEffect(() => {
    console.log("🚀 ~ State Updated: ", {
      projects,
      skills,
      personalInfo,
      loading,
      error,
    });
  }, [projects, skills, personalInfo, loading, error]);

  return (
    <DataContext.Provider value={{ projects, skills, personalInfo, loading, error }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = React.useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

