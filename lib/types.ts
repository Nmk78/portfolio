export interface Project {
  id: string;
  title: string;
  shortDesc: string;
  description: string;
  githubLink: string;
  liveLink: string;
  images: string[];
  techStack: string[];
  keyFeatures: string[];
}

export interface Skill {
  id: string;
  name: string;
  // Add other relevant fields
}

export interface PersonalInfo {
  id: string;
  name: string;
  bio: string;
  description: string;
}

export interface CV {
  id: string;
  name: string;
  url: string;
}

export type MimeTypeMap = {
  [key: string]: string; // This allows any string to be a key
};

export interface Context {
  id?: string;
  content: string;
}
