"use client";

//@ts-nocheck

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, ExternalLink, ChevronRight, } from "lucide-react";
import DynamicIcons from "./DynamicIcon";

// Fake API fetch function (simulating a 2-second delay)
const fetchProjectData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        title: "Library Managment System",
        subtitle: "Ease way of finding books and using library",
        githubLink: "https://github.com/yourusername/eco-smart-home",
        liveLink: "https://eco-smart-home.com",
        images: [
          { src: "/images/lbms/adminPanel.png", width: 800, height: 600 },
          { src: "/images/lbms/home.png", width: 400, height: 300 },
          { src: "/images/lbms/adminPanel.png", width: 400, height: 300 },
          { src: "/images/lbms/home.png", width: 400, height: 300 },
          { src: "/images/lbms/adminPanel.png", width: 400, height: 300 },
          { src: "/images/lbms/home.png", width: 400, height: 300 },
        ],
        techStack: [
          { name: "expo", logo: "/placeholder.svg?height=40&width=40" },
          { name: "nodedotjs", logo: "/placeholder.svg?height=40&width=40" },
          { name: "react", logo: "/placeholder.svg?height=40&width=40" },
          { name: "tensorflow", logo: "/placeholder.svg?height=40&width=40" },
          { name: "amazonwebservices", logo: "/placeholder.svg?height=40&width=40" },
          { name: "android", logo: "/placeholder.svg?height=40&width=40" },
        ],
        features: [
          "Real-time energy monitoring",
          "AI-powered recommendations",
          "Smart device integration",
          "Carbon footprint tracking",
          "Customizable automation",
        ],
      });
    }, 500); // Simulate 2-second delay
  });
};

export default function ProjectDetails() {
  const [projectData, setProjectData] = useState(null); // Initially no data
  const [loading, setLoading] = useState(true); // Loading state
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Simulate API call
    fetchProjectData().then((data) => {
      setProjectData(data);
      setLoading(false); // Set loading to false once data is fetched
    });
  }, []);

  if (loading) {
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
        <h1 className="text-4xl font-bold mb-2">{projectData.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {projectData.subtitle}
        </p>
        <div className="flex flex-wrap gap-4 mb-4">
          {projectData.techStack.map((tech, index) => (
            <div
              key={index}
              className="flex items-center bg-secondary rounded-full px-3 py-1"
            >
                {/* <DynamicIcons /> */}
                <DynamicIcons icon={tech.name} />
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-4">
          <Button variant="default" className="flex items-center">
            <Github className="w-4 h-4 mr-2" />
            View Code
          </Button>
          <Button variant="outline" className="flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            Live Demo
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <Card className="border-0 shadow-none ml-4">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {projectData.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <ChevronRight className="w-4 h-4 mr-2 text-primary flex-shrink-0 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <div className="aspect-video relative overflow-hidden rounded-lg">
          <Image
            src={projectData.images[0].src}
            alt="Main project image"
            fill
            priority
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {projectData.images.slice(1).map((image, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedImage(image)}
            className="relative aspect-video overflow-hidden rounded-lg cursor-pointer"
          >
            <Image
              src={image.src}
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
                src={selectedImage.src}
                placeholder="empty" // "empty" | "blur" | "data:image/..."
                // sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                alt="Selected project image"
                height="1000"
                width="1000"
                className=" object-cover rounded-lg w-full"
              />
              <Button
                variant="secondary"
                className="absolute top-4 right-4"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log("🚀 ~ ProjectDetails ~ e:", e);
                  setSelectedImage(null);
                }}
              >
                Close
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
