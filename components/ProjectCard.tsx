import React from "react";
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Project } from "@/lib/types"; // Import your Project type from the correct path
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <Link href={`project/${project.slug}`}>
      <Card
        key={project.id}
        className="bg-gray-50 overflow-hidden group hover:scale-95 transition-transform duration-500"
      >
        <CardContent className="p-0 relative space-y-2">
          {project?.images?.length > 0 && (
            <div className="relative w-full h-40 sm:h-52 md:h-60 overflow-hidden">
              <Image
                src={project.images[0]}
                alt={project.title}
                fill // Use the `fill` prop for layout
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // You can adjust sizes based on screen size
                priority={true} // Use priority if this image is important for loading speed
                className="transition-transform duration-500 group-hover:scale-110 object-cover" // Add object-cover to ensure the image covers the container
              />
            </div>
          )}
          <div className="absolute bottom-0 h-1/4 w-full pl-3 sm:pl-5 md:pl-7 font-bold text-red-500 z-10 bg-gradient-to-t from-gray-500/40 via-gray-500/10 to-transparent backdrop-blur-sm transition-all duration-500 group-hover:backdrop-blur-md group-hover:from-gray-500/50">
            <h3 className="text-lg sm:text-xl md:text-2xl">{project.title}</h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProjectCard;
