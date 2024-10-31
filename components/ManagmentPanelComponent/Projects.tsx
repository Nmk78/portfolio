"use client";

import { useEffect, useState } from "react";
import { Trash2, Plus, Briefcase, ExternalLink, Pencil, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Project as ProjectType } from "@/lib/types";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MultiImageDropzone } from "@/lib/EdgeMultiImageUploadZone";
import { useEdgeStore } from "@/lib/edgestore";
import { FileState } from "@/lib/EdgeMultiFileUploadZone";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import DynamicIcons from "../DynamicIcon";
import { ScrollArea } from "../ui/scroll-area";

import ProjectCard from "@/components/ProjectCard"

const Projects = () => {
  const [projects, setProjects] = useState<ProjectType[]>([]); // For API data

  //For local input states
  const [title, setTitle] = useState<string>("");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [liveLink, setLiveLink] = useState<string>("");
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);

  ////////////
  const [newTechItem, setNewTechItem] = useState<string>("");

  const handleAddTechItem = () => {
    if (newTechItem.trim() !== "" && !techStack.includes(newTechItem.trim())) {
      setTechStack([...techStack, newTechItem.trim()]);
      setNewTechItem("");
    }
  };

  const [newFeature, setNewFeature] = useState<string>("");

  const handleRemoveTechItem = (tech: string) => {
    setTechStack(techStack.filter((item) => item !== tech));
  };

  const handleAddFeature = () => {
    if (newFeature.trim() !== "" && !keyFeatures.includes(newFeature.trim())) {
      setKeyFeatures([...keyFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setKeyFeatures(keyFeatures.filter((item) => item !== feature));
  };

  ////////////
  const { edgestore } = useEdgeStore();

  const fetchProjects = async () => {
    const { data } = await axios.get("/api/projects");
    setProjects(data?.data)
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  // useEffect(() => {
  //   if (!error && !isLoading) {
  //     setProjects(data.data);
  //   }
  // }, [data, isLoading, error]);

  const handleFilesChange = (newFiles: FileState[]) => {
    setFileStates(newFiles); // Ensure this updates the state correctly
  };

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const handleUploadImages = async (addedFiles: FileState[]) => {
    const urls: string[] = [];

    await Promise.all(
      addedFiles.map(async (addedFileState) => {
        try {
          const res = await edgestore.publicImages.upload({
            file: addedFileState.file,
            onProgressChange: (progress) => {
              updateFileProgress(addedFileState.key, progress);
              if (progress === 100) {
                updateFileProgress(addedFileState.key, "COMPLETE");
              }
            },
          });
          urls.push(res.url); // Assuming res contains the URL of the uploaded image
        } catch (err) {
          updateFileProgress(addedFileState.key, "ERROR");
        }
      })
    );

    return urls;
  };

  // const addProject = async (newProject: {
  //   name: string;
  //   description: string;
  //   link: string;
  //   images: string[]; // Added to match the uploaded images
  // }) => {
  //   try {
  //     const response = await fetch("/api/projects", {
  //       method: "POST",
  //       body: JSON.stringify(newProject),
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     const addedProject = await response.json();
  //     setProjects((prev) => [...prev, addedProject]);

  //     // Clear uploaded image URLs and file states after adding the project
  //     setUploadedImageUrls([]);
  //     setFileStates([]);
  //   } catch (error) {
  //     console.error("Error adding project:", error);
  //   }
  // };

  const addProject = async (newProject: {
    title: string;
    shortDesc: string;
    description: string;
    githubLink: string;
    liveLink: string;
    images: string[]; // List of image URLs
    techStack: string[]; // List of technologies
    keyFeatures: string[]; // List of features
  }) => {
    //This function will run after uploading the images to edgeStore, to save the url in the mongodb
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: JSON.stringify(newProject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Check if the response is OK (status code 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const addedProject = await response.json();
      setProjects((prev) => [...prev, addedProject]);

      // Clear uploaded image URLs and file states after adding the project
      setUploadedImageUrls([]);
      setFileStates([]);
    } catch (error) {
      console.error("Error adding project:", error);
      // Optionally display a user-friendly error message
      alert("Failed to add project. Please try again.");
    }
  };

  const handleAddProject = async () => {
    const imageUrls = await handleUploadImages(fileStates);

    // Prepare the tech stack and features (you can also use input fields for these)
    const tech_stack = techStack;
    const features = keyFeatures; // Gather from input or state

    // Call addProject with the gathered data
    addProject({
      title,
      shortDesc,
      description,
      githubLink,
      liveLink,
      images: imageUrls,
      techStack,
      keyFeatures,
    });
  };

  const updateProject = async (
    projectId: string,
    updatedProject: ProjectType,
    newImages: File[]
  ) => {
    // try {
    //   const formData = new FormData();
    //   formData.append("name", updatedProject.name);
    //   formData.append("description", updatedProject.description);
    //   formData.append("link", updatedProject.link);
    //   updatedProject.images.forEach((image, index) => {
    //     formData.append(`existingImage${index}`, JSON.stringify(image));
    //   });
    //   newImages.forEach((image, index) => {
    //     formData.append(`newImage${index}`, image);
    //   });
    //   await fetch(`/api/projects?id=${projectId}`, {
    //     method: "PUT",
    //     body: formData,
    //   });
    //   setProjects(
    //     projects.map((project) =>
    //       project.id === projectId ? updatedProject : project
    //     )
    //   );
    // } catch (error) {
    //   console.error("Error updating project:", error);
    // }
  };

  const removeProject = async (projectId: string) => {
    // try {
    //   await fetch(`/api/projects?id=${projectId}`, {
    //     method: "DELETE",
    //   });
    //   setProjects(projects.filter((project) => project.id !== projectId));
    // } catch (error) {
    //   console.error("Error removing project:", error);
    // }
  };

  return (
    <Card className="md:col-span-3 border rounded-none shadow-none">
      <div className="flex justify-start items-center pr-5">
        <CardHeader>
          <CardTitle className="flex flex-row items-center text-red-600">
            <Briefcase className="mr-2 h-5 w-5" />
            Projects
          </CardTitle>
        </CardHeader>
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              className="w-10 flex items-center justify-center"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="w-full h-[85vh] max-w-6xl mx-auto flex flex-col bg-gray-100">
            <DrawerHeader className="flex-shrink-0">
              <DrawerTitle className="text-red-600">
                Add New Project
              </DrawerTitle>
            </DrawerHeader>
            <ScrollArea className="flex-grow">
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-project-name">Project Name</Label>
                    <Input
                      id="new-project-name"
                      placeholder="Enter project name"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-project-subtitle">
                      Project Subtitle
                    </Label>
                    <Input
                      id="new-project-subtitle"
                      placeholder="Enter project subtitle"
                      value={shortDesc}
                      onChange={(e) => setShortDesc(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-project-description">
                      Project Description
                    </Label>
                    <Textarea
                      className="border-gray-300"
                      id="new-project-description"
                      placeholder="Enter project description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-project-features">Key Features</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {keyFeatures.map((feature) => (
                        <div
                          key={feature}
                          className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full flex items-center"
                        >
                          <span>{feature}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveFeature(feature)}
                            className="ml-1 p-0 h-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="new-project-features"
                        placeholder="Add key feature"
                        value={newFeature}
                        onChange={(e) => setNewFeature(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddFeature();
                          }
                        }}
                      />
                      <Button onClick={handleAddFeature}>Add</Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-project-techstack">Tech Stack</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {techStack.map((tech) => (
                        <div key={tech} className="px-2 py-1 flex items-center">
                          {/* <div key={tech} className="bg-red-100 text-red-600 px-2 py-1 rounded-full flex items-center"> */}
                          <DynamicIcons icon={tech} />
                          <span className="ml-1">{tech}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTechItem(tech)}
                            className="ml-1 p-0 h-auto"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        id="new-project-techstack"
                        placeholder="Add tech stack item"
                        value={newTechItem}
                        onChange={(e) => setNewTechItem(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTechItem();
                          }
                        }}
                      />
                      <Button onClick={handleAddTechItem}>Add</Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-project-github">GitHub Link</Label>
                    <Input
                      id="new-project-github"
                      placeholder="Enter GitHub link"
                      value={githubLink}
                      onChange={(e) => setGithubLink(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-project-live">Live Link</Label>
                    <Input
                      id="new-project-live"
                      placeholder="Enter live link"
                      value={liveLink}
                      onChange={(e) => setLiveLink(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-project-images">Project Images</Label>
                    <div className="w-auto h-auto flex justify-center items-center">
                      <MultiImageDropzone
                        value={fileStates}
                        onChange={handleFilesChange}
                        dropzoneOptions={{ maxFiles: 10 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <DrawerFooter className="flex-shrink-0">
              <Button
                type="button"
                className="w-full bg-red-600 text-white hover:bg-red-700"
                onClick={handleAddProject}
              >
                Add Project
              </Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {projects.map((project) => (
            <ProjectCard project={project} updateFn={updateProject} removeFn={removeProject}/>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default Projects;
