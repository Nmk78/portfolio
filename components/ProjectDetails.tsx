"use client";

//@ts-nocheck

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  ExternalLink,
  ChevronRight,
  Minimize2,
  Trash,
  Edit,
  X,
  Loader2,
} from "lucide-react";
import DynamicIcons from "./DynamicIcon";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Project } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FileState, MultiImageDropzone } from "@/lib/EdgeMultiImageUploadZone";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/use-toast";
import { useEdgeStore } from "@/lib/edgestore";
import CustomAlertDialog from "./ui/CustomAlertDialog";

export default function ProjectDetails() {
  const [project, setProject] = useState<Project | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const { id } = useParams(); // Extract the 'id' from the URL parameters
  const queryClient = useQueryClient();
  const { edgestore } = useEdgeStore();

  const [title, setTitle] = useState<string>("");
  const [shortDesc, setShortDesc] = useState<string>("");
  const [keyFeatures, setKeyFeatures] = useState<string[]>([]);
  const [description, setDescription] = useState<string>("");
  const [githubLink, setGithubLink] = useState<string>("");
  const [techStack, setTechStack] = useState<string[]>([]);
  const [liveLink, setLiveLink] = useState<string>("");
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [newTechItem, setNewTechItem] = useState<string>("");
  const [newFeature, setNewFeature] = useState<string>("");

  /// Delete
  async function deleteProject(id: any) {
    try {
      const response = await axios.delete(`/api/projects?id=${id}`);
      return response.data;
    } catch (error) {
      console.log("🚀 ~ deleteProject ~ error:", error);
      throw new Error("Failed to delete project");
    }
  }

  // Mutation Hook for deleting project and images
  function useDeleteProjectMutation() {
    const router = useRouter();
    const { edgestore } = useEdgeStore();

    return useMutation({
      mutationFn: async ({ project }: any) => {
        // First delete the images from EdgeStore if they exist
        // if (project && project.images && project.images?.length > 0) {
        //   await Promise.all(
        //     project.images.map(async (url:any) => {
        //       try {
        //         await edgestore.publicImages.delete({ url:url }); // Assuming you have a delete method
        //       } catch (error) {
        //         console.error("Error deleting image:", error);
        //       }
        //     })
        //   );
        // }
        if (project && project.images && project.images.length > 0) {
          console.log("Attempting to delete images:", project.images);

          await Promise.all(
            project.images.map(async (url: any) => {
              try {
                console.log("Deleting image at URL:", url);
                const result = await edgestore.publicImages.delete({ url });
                console.log("Delete result:", result);
              } catch (error) {
                console.error("Error deleting image:", error);
              }
            })
          );
        }
        await deleteProject(project?.id);
      },

      onSuccess: () => {
        // Show success message
        toast({ description: "Project deleted successfully!" });

        // Redirect to /projects after deletion
        router.push("/project");
      },
      onError: (error) => {
        // Show error message
        toast({
          variant: "destructive",
          description: "Failed to delete project. Please try again.",
        });
        console.error("Error deleting project:", error);
      },
    });
  }
  //

  const handleAddTechItem = () => {
    if (newTechItem.trim() !== "" && !techStack.includes(newTechItem.trim())) {
      setTechStack([...techStack, newTechItem.trim()]);
      setNewTechItem("");
    }
  };

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

  const handleFilesChange = (newFiles: FileState[]) => {
    setFileStates(newFiles); // Ensure this updates the state correctly
  };

  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  const fetchProject = async (id: string | string[]) => {
    if (!id) return null; // Return null if no ID
    const response = await axios.get(`/api/projects?id=${id}`);
    setProject(response.data.data);
    console.log("🚀 ~ fetchProject ~ response:", response);
    return response.data.data;
  };

  const { isLoading } = useQuery({
    queryKey: ["project", id],
    queryFn: () => {
      fetchProject(id);
    },
  });

  useEffect(() => {
    if (project == null) return;

    setTitle(project.title || "");
    setShortDesc(project.shortDesc || "");
    setKeyFeatures(project.keyFeatures || []);
    setDescription(project.description || "");
    setGithubLink(project.githubLink || "");
    setTechStack(project.techStack || []);
    setLiveLink(project.liveLink || "");
    setUploadedImageUrls(project.images || []);
    setFileStates([]); // Reset file states for new uploads if any
  }, [project]);

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
          console.log("🚀 ~ addedFiles.map ~ err:", err)
          updateFileProgress(addedFileState.key, "ERROR");
        }
      })
    );

    return urls;
  };

  const handleUpdateProject = async () => {
    console.log("Handle Update Project Fn running");
    try {
      // Step 1: Identify removed images
      const removedImages = project?.images.filter(
        (url) => !uploadedImageUrls.includes(url)
      );

      // Step 2: Delete removed images from EdgeStore
      if (removedImages && removedImages?.length > 0) {
        await Promise.all(
          removedImages.map(async (url) => {
            try {
              await edgestore.publicImages.delete({ url: url }); // Assuming you have a delete method
            } catch (error) {
              console.error("Error deleting image:", error);
            }
          })
        );
      }

      // Step 3: Upload new images
      // const newImages = fileStates.filter(
      //   (file) => !uploadedImageUrls.includes(file.url)
      // );

      const newImages = fileStates.filter((fileState) => {
        // Create a URL for the file object
        const fileUrl = URL.createObjectURL(fileState.file);
        return !uploadedImageUrls.includes(fileUrl);
      });
  
      const newImageUrls = await handleUploadImages(newImages);

      // Step 4: Prepare updated project data
      const updatedProject = {
        title,
        shortDesc,
        description,
        githubLink,
        liveLink,
        images: [...uploadedImageUrls, ...newImageUrls], // Combine existing and new image URLs
        techStack,
        keyFeatures,
      };

      // Step 5: Send updated project data to the API
      const response = await fetch(`/api/projects?id=${id}`, {
        method: "PUT",
        body: JSON.stringify(updatedProject),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const updatedProjectData = await response.json();
      // Update the state with the new project data
      setProject(updatedProjectData);

      // Optionally, clear file states and image URLs
      setUploadedImageUrls([]);
      setFileStates([]);
      return updatedProjectData;
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project. Please try again.");
    }

    console.log("Handle Update Project Fn Done");
  };

  const mutation = useMutation({
    mutationFn: async () => handleUpdateProject(), // Mutation function

    onSuccess: async () => {
      toast({ description: "Project updated successfully!" });

      // Invalidate and refetch the updated project data
      await queryClient.invalidateQueries({
        queryKey: ["project", project?.id],
      });
      await queryClient.refetchQueries({
        queryKey: ["project", project?.id],
        type: "active",
        exact: true,
      });

      setDrawerOpen(false);
    },

    onError: (error: any) => {
      toast({
        variant: "destructive",
        description: "Failed to update project. Please try again.",
      });
      console.error("Error updating project:", error);
    },
  });

  const handleUpdate = async () => {
    // e.preventDefault(); // To prevent default form submission
    console.log("Handle update fn run");

    try {
      await mutation.mutateAsync(); // Ensure this is correctly defined in the context
      console.log("Project successfully updated!");
    } catch (error) {
      console.error("Error during project update:", error);
    }
  };

  /// For Delete

  // Function to delete the project by ID in MongoDB

  // Mutation function

  if (isLoading || !project) {
    return (
      <div className="container mx-auto px-4 mt-12 py-12">
        {/* Skeleton loader for title */}
        <div className="mb-8">
          <div className="h-8 w-3/4 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
          <div className="h-6 w-1/2 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
          <div className="flex flex-wrap gap-4 mb-4">
            {/* Skeleton loader for tech stack */}
            {[...Array(5)].map((_, index) => (
              <div
                key={index}
                className="h-8 w-20 bg-gray-300 rounded-full animate-pulse"
              ></div>
            ))}
          </div>
          <div className="flex gap-4">
            <div className="h-10 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
            <div className="h-10 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>
        </div>

        {/* Skeleton loader for key features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <div className="h-6 w-1/4 bg-gray-300 rounded-lg animate-pulse mb-4"></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {[...Array(5)].map((_, index) => (
                  <li
                    key={index}
                    className="h-4 w-full bg-gray-300 rounded-lg animate-pulse"
                  ></li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Skeleton loader for the main image */}
          <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-300 animate-pulse"></div>
        </div>

        {/* Skeleton loader for images */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="relative aspect-video overflow-hidden rounded-lg bg-gray-300 animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 mt-12 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{project?.title}</h1>
        <p className="text-xl text-gray-900 mb-4">
          {project?.shortDesc}
        </p>
        <p className="text-md text-balance text-gray-900 mb-4">
          {project?.description}
        </p>

        <div title="Used tech stacks" className="flex flex-wrap gap-4 mb-4">
          {project?.techStack?.map((tech, index) => (
            <div
              key={index}
              className="flex flex-col justify-center items-center bg-secondary rounded-full py-1 space-y-2"
            >
              {/* <DynamicIcons /> */}
              <DynamicIcons icon={tech} />
              <span className="text-sm font-medium">{tech}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <a
            href={project?.githubLink}
            target="_blank"
            className="flex items-center"
          >
            <Github className="w-4 h-4 mr-2" />
            View Code
          </a>
          <a
            target="_blank"
            href={project?.liveLink}
            className=" ring-1 ring-gray-300 px-2 py-1.5 rounded-md flex items-center"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Demo
          </a>
          {/* Edit Button */}

          {project && (
            <>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <button
                    // onClick={() => editProject(project.id)} // Function to handle edit
                    className=" px-2 py-1.5 rounded-md flex items-center bg-blue-500 text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />{" "}
                    {/* You can use an icon for Edit */}
                    Edit
                  </button>
                </DrawerTrigger>
                <DrawerContent className="w-full h-[85vh] max-w-6xl mx-auto flex flex-col bg-gray-100">
                  <DrawerHeader className="flex-shrink-0">
                    <DrawerTitle className="text-red-600">
                      Edit Project
                    </DrawerTitle>
                  </DrawerHeader>
                  <ScrollArea className="flex-grow">
                    <form
                      onSubmit={handleUpdate}
                      className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
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
                          <Label htmlFor="new-project-features">
                            Key Features
                          </Label>
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
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddFeature();
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-project-techstack">
                            Tech Stack
                          </Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {techStack.map((tech) => (
                              <div
                                key={tech}
                                className="px-2 py-1 flex items-center"
                              >
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
                            <Button
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddTechItem();
                              }}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="new-project-github">
                            GitHub Link
                          </Label>
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
                          <Label htmlFor="new-project-images">
                            Project Images
                          </Label>
                          <div className="w-auto h-auto flex flex-col justify-center items-center">
                            <MultiImageDropzone
                              value={fileStates}
                              onChange={handleFilesChange}
                              dropzoneOptions={{
                                maxFiles: 10 - uploadedImageUrls.length,
                              }}
                            />
                            {/* <div className="w-auto h-auto gap-1 flex justify-center flex-wrap"> */}
                            <div className="grid h-auto gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                              {uploadedImageUrls?.map((url, index) => (
                                <div
                                  key={index}
                                  className="border-0 p-0 w-full h-full relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md aspect-video"
                                >
                                  <img
                                    className="h-full w-full rounded-sm object-contain"
                                    src={url}
                                    alt={`Uploaded image ${index + 1}`}
                                  />

                                  {/* Remove Image Icon */}
                                  {url && (
                                    <div
                                      className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const newValue =
                                          uploadedImageUrls.filter(
                                            (_, i) => i !== index
                                          );
                                        setUploadedImageUrls(newValue);
                                      }}
                                    >
                                      <div className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                                        <X
                                          className="text-gray-500 dark:text-gray-400"
                                          width={16}
                                          height={16}
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </form>
                  </ScrollArea>
                  <DrawerFooter className="flex-shrink-0">
                    <Button
                      // type="submit"
                      onClick={() => {
                        handleUpdate();
                      }}
                      disabled={mutation.isPending}
                      className="w-full bg-red-600 text-white hover:bg-red-700"
                    >
                      {mutation.isPending && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Edit Project
                    </Button>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <CustomAlertDialog
                title="Are you sure?"
                description="This can't be undo."
                cancelText="No"
                confirmText="Yes, Delete"
                buttonText="Delete Project"
                buttonIcon={<Trash size={16} />}
                project={project}
                useDeleteProjectMutation={useDeleteProjectMutation}
              />
            </>
          )}

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="border-0 shadow-none ml-4">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {keyFeatures?.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 text-primary flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="w-full h-80 aspect-video relative overflow- rounded-lg">
          {/* <Image
          src={project?.images[0].src}
          alt="Main project image"
          fill
          priority
          className="object-cover"
        /> */}
          <Carousel
            plugins={[plugin.current]}
            className=" w-full h-80"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {project?.images?.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1 ">
                    <Card className=" border-3 border-red-500">
                      <CardContent className="flex aspect-video object-contain items-center justify-center p-2">
                        <Image
                          src={image}
                          alt={project.title}
                          width={800} // Adjust as per your desired width
                          height={450} // Adjust as per your desired height or aspect ratio
                          className="object-cover w-full h-full"
                          priority
                        />
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {project?.images?.map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(image)}
            className="relative aspect-video overflow-hidden rounded-lg cursor-pointer"
          >
            <Image
              src={image}
              alt={`Project image ${index + 2}`}
              fill
              className="object-cover"
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="relative max-w-6xl max-h-full"
            >
              <Image
                src={selectedImage}
                placeholder="empty" // "empty" | "blur" | "data:image/..."
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Selected project image"
                height="1000"
                width="1000"
                className=" object-cover rounded-lg w-full"
              />
              <Button
                variant="secondary"
                className="absolute  top-4 right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("🚀 ~ ProjectDetails ~ e:", e);
                  setSelectedImage(null);
                }}
              >
                <Minimize2 className="w-4 h-4 mr-2" />
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
