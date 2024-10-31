import React from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, Pencil, ExternalLink } from "lucide-react"; // Ensure you import icons from lucide-react
import { Project } from "@/lib/types"; // Import your Project type from the correct path
import Link from "next/link";

// Define the ProjectType or import it from your types
type ProjectType = {
  project: Project;
  updateFn?: (
    projectId: string,
    updatedProject: Project,
    newImages: File[]
  ) => void; // Define the type for the update function
  removeFn?: (id: string) => void; // Define the type for the remove function
};

const ProjectCard = ({ project, updateFn, removeFn }: ProjectType) => {
  return (
    // <Link href={`project?id=${project.title.replace(/\s+/g, '_')}`}>
    <Link href={`project/${project.id}`}>
      <Card
        key={project.id}
        className="bg-gray-50 overflow-hidden group hover:scale-95 transition-transform duration-500"
      >
        <CardContent className="p-0 relative space-y-2">
          {project?.images?.length > 0 && (
            <div className="relative w-full h-40 sm:h-52 md:h-60 overflow-hidden">
              {/* The image container should be `relative` */}
              <Image
                src={project.images[0]} // Assuming images is an array of URLs (strings)
                alt={project.title}
                layout="fill" // Make the image cover the entire area
                objectFit="cover" // Ensure the image covers the area without distortion
                className="transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          )}

          {/* The title should be positioned over the image */}
          <div className="absolute bottom-0 h-1/4 w-full pl-3 sm:pl-5 md:pl-7 font-bold text-red-500 z-10 bg-gradient-to-t from-gray-500/40 via-gray-500/10 to-transparent backdrop-blur-sm transition-all duration-500 group-hover:backdrop-blur-md group-hover:from-gray-500/50">
            <h3 className="text-lg sm:text-xl md:text-2xl">{project.title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
