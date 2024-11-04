"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { Project } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Pencil, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";

type ProjectShowcaseProps = {
  projects: Project[];
  updateProject?: (
    projectId: string,
    updatedProject: Project,
    newImages: File[]
  ) => void;
  removeProject?: (id: string) => void;
};

const AnimatedTitle = ({ text }: { text: string }) => {
  return (
    <motion.h2
      initial="hidden"
      animate="visible"
      className="text-4xl font-bold text-center mb-12"
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          {char}
        </motion.span>
      ))}
    </motion.h2>
  );
};

const AnimatedParagraph = ({ text }: { text: string }) => {
    const words = text.split(' ')
    return (
      <motion.p
        initial="hidden"
        animate="visible"
        className="text-lg text-gray-600 dark:text-gray-300"
      >
        {words.map((word, index) => (
          <motion.span
            key={index}
            className="inline-block"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            {word}
            {index !== words.length - 1 && "\u00A0"}
          </motion.span>
        ))}
      </motion.p>
    )
  }

export default function ProjectShowcase({
  projects,
  updateProject,
  removeProject,
}: ProjectShowcaseProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);



  return (
    <section className="container mx-auto px-4 py-12">
      {/* <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-bold text-center mb-12"
      >
        My Projects
      </motion.h2> */}
      <section className="container mx-auto flex flex-col justify-center items-center px-4 py-12">

        <AnimatedTitle text="Check my projects" />
        
        <AnimatedParagraph text="Explore the tapestry of my work, where each project weaves a unique story." />

        </section>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="w-full"
          >
            <Card
              className="overflow-hidden group hover:shadow-lg transition-all duration-300"
              onMouseEnter={() => setHoveredId(project.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <CardContent className="p-0 relative">
                <Link href={`/project/${project.id}`}>
                  <div className="relative w-full h-64 overflow-hidden">
                    {project?.images?.length > 0 ? (
                      <Image
                        src={project.images[0]}
                        alt={project.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">
                          No image available
                        </span>
                      </div>
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 1 }}
                    animate={{ opacity: hoveredId === project.id ? 0.8 : 1 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"
                  />
                  <AnimatePresence>
                    {hoveredId !== project.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-4 text-white"
                      >
                        <h3 className="text-xl font-bold">{project.title}</h3>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <AnimatePresence>
                    {hoveredId === project.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-0 left-0 right-0 p-4 text-white"
                      >
                        <h3 className="text-xl font-bold mb-2">
                          {project.title}
                        </h3>
                        <p className="text-sm line-clamp-3">
                          {project.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Link>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hoveredId === project.id ? 1 : 0,
                    scale: hoveredId === project.id ? 1 : 0.8,
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-2 right-2 space-x-2"
                >
                  {updateProject && (
                    <Button
                      size="icon"
                      variant="secondary"
                      onClick={(e) => {
                        e.preventDefault();
                        updateProject(project.id, project, []);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">Edit project</span>
                    </Button>
                  )}
                  {removeProject && (
                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        removeProject(project.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete project</span>
                    </Button>
                  )}
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
