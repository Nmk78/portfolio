"use client";

//@ts-nocheck

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ChevronRight, Minimize2 } from "lucide-react";
import DynamicIcons from "./DynamicIcon";
import { Description } from "@radix-ui/react-dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Project } from "@/lib/types";
import { useParams } from "next/navigation";

export default function ProjectDetails() {
  const [project, setProject] = useState<Project | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { id } = useParams(); // Extract the 'id' from the URL parameters
  console.log("🚀 ~ ProjectDetails ~ id:", id);

  const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

  const fetchProject = async (id: string | string[]) => {
    if (!id) return null; // Return null if no ID
    const response = await axios.get(`/api/projects?id=${id}`);
    setProject(response.data.data);
    console.log("🚀 ~ fetchProject ~ response:", response);
    return response.data.data;
  };

  // Use useQuery to fetch the project based on ID
  // const { data: project, isLoading, error } = useQuery(
  //   ["project"], // Use the ID in the query key
  //   () => fetchProject(id), // Call fetchProject with the ID

  // );

  const { data, isLoading, error } = useQuery({
    queryKey: ["project", id],
    queryFn: () => {
      fetchProject(id);
    },
  });

  // State for projects

  // useEffect(() => {
  //   if (project) {
  //     setProjects(project?.data); // Set the projects state to the fetched data
  //   }
  // }, [project])

  if (isLoading) {
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
        <p className="text-xl text-muted-foreground mb-4">
          {project?.shortDesc}
        </p>
        <p className="text-md text-balance text-muted-foreground mb-4">
          {project?.description}
        </p>

        <div title="Used tech stacks" className="flex flex-wrap gap-4 mb-4">
          {project?.techStack?.map((tech, index) => (
            <div
              key={index}
              className="flex items-center bg-secondary rounded-full py-1 space-x-2"
            >
              {/* <DynamicIcons /> */}
              <DynamicIcons icon={tech} />
              <span className="text-sm font-medium">{tech}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <a href={project?.githubLink} className="flex items-center">
            <Github className="w-4 h-4 mr-2" />
            View Code
          </a>
          <a href={project?.liveLink} className=" ring-1 ring-gray-300 px-2 py-1.5 rounded-md flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Demo
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="border-0 shadow-none ml-4">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {project?.keyFeatures?.map((feature, index) => (
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
