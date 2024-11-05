
// import { ProjectDetails } from "@/components/ProjectDetails";
// import { PageProps } from "@/lib/types";
// import axios from "axios";
// import { redirect } from "next/navigation";
// import React from "react";

// // Function to fetch project data by ID
// const getProject = async (id: string) => {
//   try {
//     const response = await axios.get(
//       `http://localhost:3000/api/projects?id=${id}`
//     );
//     return response.data.data;
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     return null;
//   }
// };

// // Function to generate metadata dynamically
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const project = await getProject(params.id);
//   const baseUrl = process.env.url || "http://localhost:3000";

//   if (!project) {
//     return {
//       title: "Project Not Found | Your Site",
//       description: "This project does not exist.",
//     };
//   }
//   const titleKeywords = project.title.split(" ");

//   const keywords = [
//     ...project.techStack, // Technologies
//     ...titleKeywords, // Title words
//     ...project.keyFeatures, // Key features
//   ].join(", ");
//   return {
//     title: `${project.title} | Nay Myo Khant`,
//     description: project.shortDesc,
//     openGraph: {
//       title: project.title,
//       description: project.shortDesc,
//       images: project.images.length ? [{ url: project.images[0] }] : [],
//       url: `${baseUrl}/project/${project.id}`,
//     },
//     twitter: {
//       card: "summary_large_image",
//       title: project.title,
//       description: project.shortDesc,
//       images: project.images.length ? [{ url: project.images[0] }] : [],
//     },
//     keywords: keywords,
//     alternates: {
//       canonical: `${baseUrl}/project/${project.id}`,
//     },
//   };
// }

// // Main Page component
// const Page: React.FC<PageProps> = async ({ params }) => {
//   if (!params?.id) {
//     throw new Error("Project ID is required");
//   }

//   // Fetch the project using the helper function
//   const project = await getProject(params.id);

//   // Handle the case where the project is not found
//   if (!project) {
//     redirect("/not-found");
//     return null;
//   }

//   // Render the ProjectDetails component with the fetched data
//   return <ProjectDetails passedProject={project} />;
// };

// export default Page;


import { ProjectDetails } from "@/components/ProjectDetails";
import { PageProps } from "@/lib/types";
import { redirect } from "next/navigation";
import React from "react";

// Function to fetch project data by ID
const getProject = async (id: string) => {
  try {
    const response = await fetch(
      `/api/projects?id=${id}`
    );
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
      title: "Project Not Found | Your Site",
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
    openGraph: {
      title: project.title,
      description: project.shortDesc,
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
    alternates: {
      canonical: `${baseUrl}/project/${project.id}`,
    },
  };
}

// Main Page component (make it async)
const Page = async ({ params }: PageProps) => {
  if (!params?.id) {
    throw new Error("Project ID is required");
  }

  // Fetch the project using the helper function
  const project = await getProject(params.id);
  console.log("🚀 ~ Page ~ project:", project)

  // Handle the case where the project is not found
  // if (!project) {
  //   redirect("/not-found");
  //   return null;
  // }

  // Render the ProjectDetails component with the fetched data
  return <ProjectDetails passedProject={project} />;
};

export default Page;
