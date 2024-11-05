// import type { MetadataRoute } from "next";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = process.env.url || "http://localhost:3000";
//   const response = await fetch("/api/projects");
//   const { posts } = await response.json();

//   const postEntries: MetadataRoute.Sitemap = posts.map(({ id }) => ({
//     url: `${process.env.NEXT_PUBLIC_BASE_URL}/posts/${id}`,
//     // lastModified: new Date(post.updatedAt),
//     // changeFrequency:,
//     // priority:
//   }));
//   return [{ 
//     url: `${baseUrl}/about` 

// }];
// }

import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.url || "http://localhost:3000";
  
  // Fetch project data from your API
  const response = await fetch(`${baseUrl}/api/projects`);
  const { data: projects } = await response.json(); // Assuming 'data' holds the projects array

  // Map over the projects to create the sitemap entries
  const projectEntries: MetadataRoute.Sitemap = projects.map((project: { id: string }) => ({
    url: `${baseUrl}/projects/${project.id}`,
    lastModified: new Date().toISOString(), // You can customize this with your data, if available
    changeFrequency: "monthly", // Adjust according to your update frequency
    priority: 0.8, // Set the priority based on importance
  }));

  // You can also add static pages like 'about' or 'contact'
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];

  // Combine both dynamic and static entries
  return [...projectEntries, ...staticEntries];
}
