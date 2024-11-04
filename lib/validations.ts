import { z } from "zod";

export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  description: z.string().min(1, "Description is required"),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Project title is required"), // Updated to title
  shortDesc: z.string().min(1, "Project shortDesc is required"), // Added subtitle
  description: z.string().min(1, "Project description is required"),
  githubLink: z.union([
    z.string().url("Invalid GitHub URL").optional(), // GitHub link can be optional or a valid URL
    z.literal(""), // Allow empty string for no URL
  ]),
  liveLink: z.union([
    z.string().url("Invalid live URL").optional(), // Live link can be optional or a valid URL
    z.literal(""), // Allow empty string for no live URL
  ]),
  images: z
    .array(z.string().url("Invalid image URL"))
    .nonempty("At least one image is required"), // Added images
  techStack: z.array(z.string()).nonempty("Tech stack must not be empty"), // Added techStack
  keyFeatures: z.array(z.string()).nonempty("Features must not be empty"), // Added features
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
});

export const cvSchema = z.object({
  name: z.string().min(1, "Name is required"),
  url: z.string().url("Invalid URL"),
});

export const chatcontext = z.object({
  context: z.string().min(1, "Context data is required"),
});
