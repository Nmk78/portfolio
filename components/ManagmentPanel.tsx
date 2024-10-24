//@ts-nocheck
"use client";

import { useEffect, useState } from "react";
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
import { useUser } from "@clerk/nextjs";
import Loading from "./Loading";
import { Project, Skill, PersonalInfo, useData } from "@/context/DataContext";
import { fetchData } from "@/lib/fetcher";

export default function ManagmentPanel() {
  
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const { user } = useUser();

  const [projects, setProjects] = useState<Project[]>([]);
  const [personalInfoChanged, setPersonalInfoChanged] =
    useState<boolean>(false);

  const [skills, setSkills] = useState<Skill[]>([]);
  const [cv, setCv] = useState<string>("");

  // New states for tracking changes
  const [projectsToAdd, setProjectsToAdd] = useState<Project[]>([]);
  const [projectsToUpdate, setProjectsToUpdate] = useState<Project[]>([]);
  const [projectsToDelete, setProjectsToDelete] = useState<string[]>([]);

  const [skillsToAdd, setSkillsToAdd] = useState<Skill[]>([]);
  const [skillsToUpdate, setSkillsToUpdate] = useState<Skill[]>([]);
  const [skillsToDelete, setSkillsToDelete] = useState<string[]>([]); // assuming id is a string

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (!personalInfo) {
        const { data } = await fetchData(
          "http://localhost:3000/api/info",
          setPersonalInfo
        );
      }
    };

    fetchDataIfNeeded();
  }, [personalInfo]); // Re-run when info changes


  useEffect(() => {
    console.log("🚩Running Skills Fetch");
    
    const fetchDataIfNeeded = async () => {
      // Check if skills is an empty array
      if (skills?.length === 0) {
        const { data } = await fetchData(
          "http://localhost:3000/api/skills",
          setSkills
        );
        console.log("🚀 ~ Skills fetched:", data);
      } else {
        console.log("🚀 ~ Skills already fetched:", skills);
      }
    };
  
    fetchDataIfNeeded();
  }, [skills]); // Run only once on mount
  
  
  useEffect(() => {
    console.log("🚩Running Projects Fetch");
    
    const fetchDataIfNeeded = async () => {
      // Check if projects is an empty array
      if (projects?.length === 0) {
        const { data } = await fetchData(
          "http://localhost:3000/api/projects",
          setProjects
        );
        console.log("🚀 ~ Projects fetched:", data);
      } else {
        console.log("🚀 ~ Projects already fetched:", projects);
      }
    };
  
    fetchDataIfNeeded();
  }, [projects]); // Run only once on mount
  

  console.log("🚀 ~ personalInfo ~ info:", personalInfo);
  console.log("🚀 ~ skills ~ info:", skills);
  console.log("🚀 ~ projects ~ info:", projects);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    //FIXME: Handle Loading
    try {
      if (personalInfoChanged) {
        await fetch("/api/info", {
          method: "PUT",
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
          await fetch(`/api/projects?id=${project.id}`, {
            method: "PUT",
            body: JSON.stringify(project),
            headers: { "Content-Type": "application/json" },
          });
        })
      );

      await Promise.all(
        projectsToDelete.map(async (projectId) => {
          await fetch(`/api/projects?id=${projectId}`, {
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
          await fetch(`/api/skills?id=${skill.id}`, {
            method: "PUT",
            body: JSON.stringify({ name: skill.name }),
            headers: { "Content-Type": "application/json" },
          });
        })
      );

      await Promise.all(
        skillsToDelete.map(async (skillId) => {
          await fetch(`/api/skills?id=${skillId}`, {
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

      console.log("Data submitted successfully");
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

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
          <CardContent className="space-x-4 flex md:flex-row flex-col justify-center items-center">
            <div className="md:w-1/3 w-1/2 flex-shrink-0">
              {!user ? (
                <Loading />
              ) : (
                <Image
                  src={user?.imageUrl}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="object-cover w-full h-full rounded-full md:rounded-sm"
                />
              )}{" "}
            </div>

            <div className="w-full md:w-2/3 flex-grow space-y-2 mt-4 md:mt-0">
              <div className="space-y-2">
                <Dialog>
                  <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
                    <div className="w-full sm:w-1/2 space-y-2">
                      <Label className="text-sm font-medium">Github</Label>
                      <Button
                        variant="outline"
                        className="w-full justify-between cursor-not-allowed opacity-70"
                      >
                        {user?.username}
                      </Button>
                    </div>
                    <div className="w-full sm:w-1/2 space-y-2">
                      <Label className="text-sm font-medium">Email</Label>
                      <Button
                        variant="outline"
                        className="w-full justify-between overflow-x-clip cursor-not-allowed opacity-70"
                      >
                        {user?.primaryEmailAddress?.emailAddress}
                      </Button>
                    </div>
                  </div>
                </Dialog>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {personalInfo?.name}
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
                      value={personalInfo?.name}
                      onChange={handlePersonalInfoChange}
                      className="mt-2"
                    />
                  </DialogContent>
                </Dialog>
              </div>{" "}
              <div className="space-y-2 w-full">
                <Label className="text-sm font-medium">Bio</Label>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between"
                    >
                      {personalInfo?.bio}
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
                      value={personalInfo?.bio}
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
                      {personalInfo?.description}
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
                      value={personalInfo?.description}
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
              {Array.isArray(skills) && skills.length > 0 ? (
                skills.map((skill, index) => (
                  <Dialog key={index}>
                    <DialogTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="text-red-600 bg-red-100 cursor-pointer"
                      >
                        {skill.name}
                      </Badge>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-100">
                      <DialogHeader>
                        <DialogTitle>Edit Skill</DialogTitle>
                      </DialogHeader>
                      <Input
                        defaultValue={skill.name}
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
                ))
              ) : (
                <p>No skills available.</p>
              )}
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
              {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project, index) => (
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
                            View Project{" "}
                            <ExternalLink className="ml-1 h-3 w-3" />
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
                          <Label htmlFor="edit-project-name">
                            Project Name
                          </Label>
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
                          <Label htmlFor="edit-project-link">
                            Project Link
                          </Label>
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
                ))
              ) : (
                <p>No project available.</p>
              )}
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
