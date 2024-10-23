import { z } from 'zod'

export const personalInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  bio: z.string().min(1, "Bio is required"),
  description: z.string().min(1, "Description is required"),
})

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(1, "Project description is required"),
  link: z.string().url("Invalid URL"),
})

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
})