import { ProjectDetails } from "@/components/ProjectDetails";
import { PageProps } from "@/lib/types";
import React from "react";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

const getProject = async (slug: string) => {
  try {
    const response = await fetch(`${baseUrl}/api/projects?slug=${slug}`);
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error fetching project:", error);
    return null;
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const project = await getProject(params.slug);

  if (!project) {
    return {
      title: "Project Not Found | Nay Myo Khant",
      description: "This project does not exist.",
    };
  }

  const titleKeywords = project.title.split(" ");

  const keywords = [
    ...project.techStack,
    ...titleKeywords,
    ...project.keyFeatures,
  ].join(", ");

  return {
    title: `${project.title} | Nay Myo Khant`,
    description: project.shortDesc,
    alternates: {
      canonical: `${baseUrl}/project/${project.slug}`,
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
      url: `${baseUrl}/project/${project.slug}`,
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

const Page = async ({ params }: PageProps) => {
  if (!params?.slug) {
    throw new Error("Project slug is required");
  }

  const project = await getProject(params.slug);

  return <ProjectDetails passedProject={project} />;
};

export default Page;
