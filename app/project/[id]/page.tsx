import { ProjectDetails } from "@/components/ProjectDetails";
import { PageProps } from "@/lib/types";
// import { redirect } from "next/navigation";
import React from "react";
const baseUrl = process.env.url || "http://localhost:3000";

// Function to fetch project data by ID
const getProject = async (id: string) => {
  try {
    const response = await fetch(`${baseUrl}/api/projects?id=${id}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
};

// Function to generate metadata dynamically
export async function generateMetadata({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  const baseUrl = process.env.url || "http://localhost:3000";

  if (!project) {
    return {
      title: "Project Not Found | Nay Myo Khant",
      description: "This project does not exist.",
    };
  }

  const titleKeywords = project.title.split(" ");

  const keywords = [
    ...project.techStack, // Technologies
    ...titleKeywords, // Title words
    ...project.keyFeatures, // Key features
  ].join(", ");

  return {
    title: `${project.title} | Nay Myo Khant`,
    description: project.shortDesc,
    alternates: {
      canonical: `${baseUrl}/project/${project.id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: project.title,
      description: project.shortDesc,
      siteName: "Nay Myo Khant",
      locale: "en_US",
      type: "website",
      images: project.images.length ? [{ url: project.images[0] }] : [],
      url: `${baseUrl}/project/${project.id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDesc,
      images: project.images.length ? [{ url: project.images[0] }] : [],
    },
    keywords: keywords,
  };
}

// Main Page component (make it async)
const Page = async ({ params }: PageProps) => {
  if (!params?.id) {
    throw new Error("Project ID is required");
  }

  // Fetch the project using the helper function
  const project = await getProject(params.id);

  return <ProjectDetails passedProject={project} />;
};

export default Page;
