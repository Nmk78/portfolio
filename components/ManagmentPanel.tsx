//@ts-nocheck
"use client";

import { useState } from "react";
import {
  Trash2,
  Plus,
  Save,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  Code,
  FileText,
  ExternalLink,
  Pencil,
  PlusSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

export default function ManagmentPanel() {
  //All Logics are here
  //   const [personalInfo, setPersonalInfo] = useState({
  //     name: "John Doe",
  //     bio: "Full-stack developer",
  //     description: "Passionate about creating user-friendly web applications.",
  //   });
  //   const [projects, setProjects] = useState([
  //     {
  //       name: "Portfolio Website",
  //       description: "Personal portfolio showcasing my work",
  //       link: "https://johndoe.com",
  //     },
  //     {
  //       name: "Task Manager",
  //       description: "A React-based task management application",
  //       link: "https://taskmanager.com",
  //     },
  //     {
  //       name: "E-commerce Platform",
  //       description: "Full-stack e-commerce solution",
  //       link: "https://myshop.com",
  //     },
  //     {
  //       name: "Weather App",
  //       description: "Real-time weather forecasting app",
  //       link: "https://weatherapp.com",
  //     },
  //   ]);
  //   const [skills, setSkills] = useState([
  //     "React",
  //     "Node.js",
  //     "TypeScript",
  //     "Python",
  //   ]);
  //   const [cv, setCv] = useState("https://naymyokhant.me/cv.pdf");
  //   const [activeSection, setActiveSection] = useState("");

  //   const handlePersonalInfoChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
  //   };

  //   const handleProjectChange = (
  //     index: number,
  //     updatedProject: { name: string; description: string; link: string }
  //   ) => {
  //     const newProjects = [...projects];
  //     newProjects[index] = updatedProject;
  //     setProjects(newProjects);
  //   };

  //   const addProject = (newProject: {
  //     name: string;
  //     description: string;
  //     link: string;
  //   }) => {
  //     setProjects([...projects, newProject]);
  //   };

  //   const removeProject = (index: number) => {
  //     setProjects(projects.filter((_, i) => i !== index));
  //   };

  //   const addSkill = (newSkill: string) => {
  //     setSkills([...skills, newSkill]);
  //   };

  //   const updateSkill = (index: number, updatedSkill: string) => {
  //     const newSkills = [...skills];
  //     newSkills[index] = updatedSkill;
  //     setSkills(newSkills);
  //   };

  //   const removeSkill = (index: number) => {
  //     setSkills(skills.filter((_, i) => i !== index));
  //   };

  //   const handleSubmit = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     console.log({ personalInfo, projects, skills, cv });
  //     // Here you would typically send this data to your backend API
  //   };

  //All Logics are here

  //Chat GPT Logic

  const [personalInfo, setPersonalInfo] = useState({
    name: "John Doe",
    bio: "Full-stack developer",
    description: "Passionate about creating user-friendly web applications.",
  });
  const [projects, setProjects] = useState([
    {
      id: 1, // Assuming each project has a unique ID
      name: "Portfolio Website",
      description: "Personal portfolio showcasing my work",
      link: "https://johndoe.com",
    },
    {
      id: 2,
      name: "Task Manager",
      description: "A React-based task management application",
      link: "https://taskmanager.com",
    },
  ]);
  const [personalInfoChanged, setPersonalInfoChanged] = useState(false);

  const [skills, setSkills] = useState([
    "React",
    "Node.js",
    "TypeScript",
    "Python",
  ]);
  const [cv, setCv] = useState("https://naymyokhant.me/cv.pdf");

  // New states for tracking changes
  const [projectsToAdd, setProjectsToAdd] = useState<any>([]);
  const [projectsToUpdate, setProjectsToUpdate] = useState<any>([]);
  const [projectsToDelete, setProjectsToDelete] = useState<any>([]);

  const [skillsToAdd, setSkillsToAdd] = useState([]);
  const [skillsToUpdate, setSkillsToUpdate] = useState([]);
  const [skillsToDelete, setSkillsToDelete] = useState([]);

  console.log("Initial Data:", { personalInfo, projects, skills, cv });

  // Handle personal info change
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
  
    setPersonalInfo((prevInfo) => {
      // Only update if there's an actual change
      if (prevInfo[name as keyof typeof prevInfo] !== value) {
        setPersonalInfoChanged(true); // Mark as changed if any field differs
        return {
          ...prevInfo,
          [name]: value,
        };
      }
      return prevInfo; // No change detected
    });
  };

  // Handle adding a new project
  const addProject = (newProject: {
    id?: number;
    name: string;
    description: string;
    link: string;
  }) => {
    const tempProject = { ...newProject, id: Date.now() }; // Temporary ID for unsaved projects
    setProjects([...projects, tempProject]);
    setProjectsToAdd([...projectsToAdd, tempProject]); // Add to projectsToAdd list
  };

  // Handle updating an existing project
  const handleProjectChange = (
    index: number,
    updatedProject: {
      id: number;
      name: string;
      description: string;
      link: string;
    }
  ) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = updatedProject;
    setProjects(updatedProjects);

    // If it's a new project (in the add list), don't put in update list
    const isInAddList = projectsToAdd.some((p) => p.id === updatedProject.id);
    if (!isInAddList) {
      setProjectsToUpdate([
        ...projectsToUpdate.filter((p) => p.id !== updatedProject.id),
        updatedProject,
      ]); // Track for updates
    }
    console.log("🚀 ~ ManagmentPanel ~ projectsToUpdate:", projectsToUpdate);
  };

  // Handle deleting a project
  const removeProject = (index: number) => {
    const projectToRemove = projects[index];
    setProjects(projects.filter((_, i) => i !== index));

    // Track for deletion if it's an existing project
    if (
      projectToRemove.id &&
      !projectsToAdd.some((p) => p.id === projectToRemove.id)
    ) {
      setProjectsToDelete([...projectsToDelete, projectToRemove.id]);
    }

    // Remove from the projectsToAdd if it's a newly added project
    setProjectsToAdd(projectsToAdd.filter((p) => p.id !== projectToRemove.id));
    setProjectsToUpdate(
      projectsToUpdate.filter((p) => p.id !== projectToRemove.id)
    ); // Remove from update list if necessary
  };

  // Handle adding a new skill
  const addSkill = (newSkill: string) => {
    setSkills([...skills, newSkill]);
    setSkillsToAdd([...skillsToAdd, newSkill]); // Track it as a new skill to add
  };

  // Handle updating a skill
  const updateSkill = (index: number, updatedSkill: string) => {
    const updatedSkills = [...skills];
    updatedSkills[index] = updatedSkill;
    setSkills(updatedSkills);

    const isInAddList = skillsToAdd.includes(updatedSkill);
    if (!isInAddList) {
      setSkillsToUpdate([
        ...skillsToUpdate.filter((skill) => skill !== skills[index]),
        updatedSkill,
      ]); // Track updates
    }
  };

  // Handle deleting a skill
  const removeSkill = (index: number) => {
    const skillToRemove = skills[index];
    setSkills(skills.filter((_, i) => i !== index));

    // If it's not a newly added skill, mark for deletion
    if (!skillsToAdd.includes(skillToRemove)) {
      setSkillsToDelete([...skillsToDelete, skillToRemove]);
    }

    // Remove from add or update lists if necessary
    setSkillsToAdd(skillsToAdd.filter((skill) => skill !== skillToRemove));
    setSkillsToUpdate(
      skillsToUpdate.filter((skill) => skill !== skillToRemove)
    );
  };

  // Handle submit, sending changes to backend
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

  // Submit personal info only if it has changed
  if (personalInfoChanged) {
    await fetch("/api/personalInfo", {
      method: "PUT", // Assuming you're updating existing info
      body: JSON.stringify(personalInfo),
      headers: { "Content-Type": "application/json" },
    });
  }
    // Process projects: Add, Update, Delete
    await Promise.all(
      projectsToAdd.map(async (project) => {
        await fetch("/api/projects", {
          method: "POST",
          body: JSON.stringify(project),
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    await Promise.all(
      projectsToUpdate.map(async (project) => {
        await fetch(`/api/projects?id="${project.name}"`, {
          method: "PUT",
          body: JSON.stringify(project),
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    await Promise.all(
      projectsToDelete.map(async (projectId) => {
        await fetch(`/api/projects?id="${projectId}`, {
          method: "DELETE",
        });
      })
    );

    // Process skills: Add, Update, Delete
    await Promise.all(
      skillsToAdd.map(async (skill) => {
        await fetch("/api/skills", {
          method: "POST",
          body: JSON.stringify({ name: skill }),
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    await Promise.all(
      skillsToUpdate.map(async (skill) => {
        await fetch(`/api/skills?id="${skill}`, {
          method: "PUT",
          body: JSON.stringify({ name: skill }),
          headers: { "Content-Type": "application/json" },
        });
      })
    );

    await Promise.all(
      skillsToDelete.map(async (skill) => {
        await fetch(`/api/skills?id="${skill}`, {
          method: "DELETE",
        });
      })
    );

    // After submission, clear the state of tracking changes
    setProjectsToAdd([]);
    setProjectsToUpdate([]);
    setProjectsToDelete([]);
    setSkillsToAdd([]);
    setSkillsToUpdate([]);
    setSkillsToDelete([]);

    console.log("Data submitted:", { personalInfo, projects, skills, cv });
  };

  /////////////

  return (
    <form
      onSubmit={handleSubmit}
      className="container mx-auto py-8 mt-16 px-4 max-w-7xl"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
        <Card className="md:col-span-2 md:row-span-2 border rounded-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <User className="mr-2 h-5 w-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-x-4 md:flex md:flex-row flex-col">
            <div className="flex-shrink-0">
              <Image
                src="https://avatars.githubusercontent.com/u/111330986?v=4"
                alt="Profile"
                width={150}
                height={150}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-grow space-y-4 mt-4 md:mt-0">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {personalInfo.name}
                      <Pencil className="h-4 w-4 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Edit Name</DialogTitle>
                    </DialogHeader>
                    <Input
                      id="name"
                      name="name"
                      value={personalInfo.name}
                      onChange={handlePersonalInfoChange}
                      className="mt-2"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Bio</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {personalInfo.bio}
                      <Pencil className="h-4 w-4 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Edit Bio</DialogTitle>
                    </DialogHeader>
                    <Input
                      id="bio"
                      name="bio"
                      value={personalInfo.bio}
                      onChange={handlePersonalInfoChange}
                      className="mt-2"
                    />
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between h-auto whitespace-normal"
                    >
                      {personalInfo.description}
                      <Pencil className="h-4 w-4 opacity-50 ml-2 flex-shrink-0" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Edit Description</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      id="description"
                      name="description"
                      value={personalInfo.description}
                      onChange={handlePersonalInfoChange}
                      className="mt-2"
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border rounded-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Code className="mr-2 h-5 w-5" />
              Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Badge
                      variant="secondary"
                      className="text-red-600 bg-red-100 cursor-pointer"
                    >
                      {skill}
                    </Badge>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Edit Skill</DialogTitle>
                    </DialogHeader>
                    <Input
                      defaultValue={skill}
                      onChange={(e) => updateSkill(index, e.target.value)}
                    />
                    <div className="flex justify-between mt-4">
                      <Button
                        variant="destructive"
                        onClick={() => removeSkill(index)}
                      >
                        Remove
                      </Button>
                      <Button
                        onClick={() =>
                          updateSkill(
                            index,
                            (
                              document.querySelector(
                                "input"
                              ) as HTMLInputElement
                            ).value
                          )
                        }
                      >
                        Save
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Skill
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-100">
                <DialogHeader>
                  <DialogTitle>Add New Skill</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Enter new skill"
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      addSkill(e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="border rounded-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <FileText className="mr-2 h-5 w-5" />
              CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Current CV:</span>
              {cv && (
                <a
                  href={cv}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-red-600 hover:underline"
                >
                  View CV <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Update CV
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-100">
                <DialogHeader>
                  <DialogTitle>Update CV Link</DialogTitle>
                </DialogHeader>
                <Input
                  placeholder="Enter new CV link"
                  value={cv}
                  onChange={(e) => setCv(e.target.value)}
                />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border rounded-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <Briefcase className="mr-2 h-5 w-5" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-full text-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-gray-100">
                  <DialogHeader>
                    <DialogTitle>Add New Project</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-project-name">Project Name</Label>
                      <Input
                        id="new-project-name"
                        placeholder="Enter project name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-project-description">
                        Project Description
                      </Label>
                      <Textarea
                        id="new-project-description"
                        placeholder="Enter project description"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-project-link">Project Link</Label>
                      <Input
                        id="new-project-link"
                        placeholder="Enter project link"
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    className="w-full bg-gray-100 border-2 "
                    onClick={() => {
                      const name = (
                        document.getElementById(
                          "new-project-name"
                        ) as HTMLInputElement
                      ).value;
                      const description = (
                        document.getElementById(
                          "new-project-description"
                        ) as HTMLTextAreaElement
                      ).value;
                      const link = (
                        document.getElementById(
                          "new-project-link"
                        ) as HTMLInputElement
                      ).value;
                      addProject({ name, description, link });
                    }}
                  >
                    Add Project
                  </Button>
                </DialogContent>
              </Dialog>
              {projects.map((project, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <Card className="bg-red-50 cursor-pointer hover:bg-red-100 transition-colors duration-200 border rounded-none">
                      <CardContent className="pt-6 space-y-2">
                        <h3 className="font-semibold">{project.name}</h3>
                        <p className="text-sm text-gray-600">
                          {project.description}
                        </p>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-red-600 hover:underline flex items-center"
                        >
                          View Project <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </CardContent>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-100">
                    <DialogHeader>
                      <DialogTitle>Edit Project</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="edit-project-name">Project Name</Label>
                        <Input
                          id="edit-project-name"
                          defaultValue={project.name}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-project-description">
                          Project Description
                        </Label>
                        <Textarea
                          id="edit-project-description"
                          defaultValue={project.description}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="edit-project-link">Project Link</Label>
                        <Input
                          id="edit-project-link"
                          defaultValue={project.link}
                        />
                      </div>
                      <div className="flex justify-between">
                        <Button
                          variant="destructive"
                          onClick={() => removeProject(index)}
                        >
                          Delete Project
                        </Button>
                        <Button
                          onClick={() => {
                            const name = (
                              document.getElementById(
                                "edit-project-name"
                              ) as HTMLInputElement
                            ).value;
                            const description = (
                              document.getElementById(
                                "edit-project-description"
                              ) as HTMLTextAreaElement
                            ).value;
                            const link = (
                              document.getElementById(
                                "edit-project-link"
                              ) as HTMLInputElement
                            ).value;
                            handleProjectChange(index, {
                              name,
                              description,
                              link,
                            });
                          }}
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              ))}
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-red-600 text-white hover:bg-red-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </form>
  );
}
