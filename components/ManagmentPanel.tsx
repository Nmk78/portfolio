"use client";

import { useEffect, useState } from "react";
import {
  Trash2,
  Plus,
  Save,
  User,
  Briefcase,
  Code,
  FileText,
  ExternalLink,
  Pencil,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Project, Skill, PersonalInfo, CV } from "@/context/DataContext";
import { fetchData } from "@/lib/fetcher";

import { useEdgeStore } from "@/lib/edgestore";
import { UploadAbortedError } from "@edgestore/react/errors";
import { FileState, MultiFileDropzone } from "@/lib/EdgeMultiFileUploadZone";
interface ExtendedProject extends Project {}
import { getDownloadUrl } from "@edgestore/react/utils";

export default function ManagementPanel() {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const { user } = useUser();

  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [cv, setCv] = useState<CV | undefined>(undefined);
  const [viewCVurl, setViewCVurl] = useState<string | undefined>(undefined);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadRes, setUploadRes] = useState<
    {
      url: string;
      filename: string;
    }[]
  >([]);
  const { edgestore } = useEdgeStore();

  useEffect(() => {
    const fetchDataIfNeeded = async () => {
      if (!personalInfo) {
        const { data } = await fetchData(
          "http://localhost:3000/api/info",
          setPersonalInfo
        );
      }
      if (skills.length === 0) {
        const { data } = await fetchData(
          "http://localhost:3000/api/skills",
          setSkills
        );
      }
      if (projects.length === 0) {
        const { data } = await fetchData(
          "http://localhost:3000/api/projects",
          setProjects
        );
      }
      if (!cv) {
        const { data } = await fetchData("http://localhost:3000/api/cv", setCv);
      }
    };

    fetchDataIfNeeded();
  }, [personalInfo, skills, projects, cv]);

  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPersonalInfo((prevInfo) =>
      prevInfo ? { ...prevInfo, [name]: value } : null
    );
  };

  const handlePersonalInfoSubmit = async () => {
    if (personalInfo) {
      try {
        await fetch("/api/info", {
          method: "PUT",
          body: JSON.stringify(personalInfo),
          headers: { "Content-Type": "application/json" },
        });
        console.log("Personal info updated successfully");
      } catch (error) {
        console.error("Error updating personal info:", error);
      }
    }
  };

  const addSkill = async (newSkill: string) => {
    try {
      const response = await fetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({ name: newSkill }),
        headers: { "Content-Type": "application/json" },
      });
      const addedSkill = await response.json();
      console.log("🚀 ~ addSkill ~ addedSkill:", addedSkill);
      setSkills([...skills, addedSkill.data]);
    } catch (error) {
      console.error("Error adding skill:", error);
    }
  };

  // const updateSkill = async (skillId: string, updatedSkillName: string) => {
  //   try {
  //     await fetch(`/api/skills?id=${skillId}`, {
  //       method: "PUT",
  //       body: JSON.stringify({ name: updatedSkillName }),
  //       headers: { "Content-Type": "application/json" },
  //     });
  //     setSkills(
  //       skills.map((skill) =>
  //         // skill.id === skillId ? { ...skill, name: updatedSkillName } : skill
  //       skill.id === String(skillId) ? { ...skill, name: updatedSkillName } : skill
  //       )
  //     );
  //   } catch (error) {
  //     console.error("Error updating skill:", error);
  //   }
  // };

  const removeSkill = async (skillId: string) => {
    try {
      await fetch(`/api/skills?id=${skillId}`, {
        method: "DELETE",
      });
      setSkills(skills.filter((skill) => skill.id !== skillId));
    } catch (error) {
      console.error("Error removing skill:", error);
    }
  };

  const addProject = async (newProject: {
    name: string;
    description: string;
    link: string;
    images: File[];
  }) => {
    try {
      const formData = new FormData();
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);
      formData.append("link", newProject.link);
      newProject.images.forEach((image, index) => {
        formData.append(`image${index}`, image);
      });

      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      });
      const addedProject = await response.json();
      setProjects([...projects, addedProject]);
    } catch (error) {
      console.error("Error adding project:", error);
    }
  };

  const updateProject = async (
    projectId: string,
    updatedProject: Project,
    newImages: File[]
  ) => {
    try {
      const formData = new FormData();
      formData.append("name", updatedProject.name);
      formData.append("description", updatedProject.description);
      formData.append("link", updatedProject.link);
      updatedProject.images.forEach((image, index) => {
        formData.append(`existingImage${index}`, JSON.stringify(image));
      });
      newImages.forEach((image, index) => {
        formData.append(`newImage${index}`, image);
      });

      await fetch(`/api/projects?id=${projectId}`, {
        method: "PUT",
        body: formData,
      });
      setProjects(
        projects.map((project) =>
          project.id === projectId ? updatedProject : project
        )
      );
    } catch (error) {
      console.error("Error updating project:", error);
    }
  };

  const removeProject = async (projectId: string) => {
    try {
      await fetch(`/api/projects?id=${projectId}`, {
        method: "DELETE",
      });
      setProjects(projects.filter((project) => project.id !== projectId));
    } catch (error) {
      console.error("Error removing project:", error);
    }
  };

  function updateFileState(key: string, changes: Partial<FileState>) {
    setFileStates((prevStates) => {
      return prevStates.map((fileState) => {
        if (fileState.key === key) {
          return { ...fileState, ...changes };
        }
        return fileState;
      });
    });
  }

  // const handleUploadClick = async (
  //   cv: CV | undefined,
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   event.preventDefault(); // Prevent default button behavior

  //   try {
  //     await Promise.all(
  //       fileStates.map(async (fileState) => {
  //         try {
  //           if (fileState.progress !== "PENDING") return;
  //           const abortController = new AbortController();
  //           updateFileState(fileState.key, { abortController });

  //           // Create a custom file name
  //           const customFileName = `Nay_Myo_Khant_cv`; // Adjust the prefix as needed
  //           const customFile = new File([fileState.file], customFileName, {
  //             type: fileState.file.type,
  //           });
  //           console.log(
  //             "🚀 ~ fileStates.map ~ customFileName:",
  //             customFileName
  //           );

  //           // Determine whether to upload a new file or replace an existing one
  //           let res;

  //           if (cv && cv.url) {
  //             // If cv exists and has a URL, replace the existing file
  //             res = await edgestore.publicFiles.upload({
  //               file: customFile,
  //               options: {
  //                 replaceTargetUrl: cv.url, // Replace the existing URL
  //               },
  //               signal: abortController.signal,
  //               onProgressChange: async (progress) => {
  //                 updateFileState(fileState.key, { progress });
  //                 if (progress === 100) {
  //                   updateFileState(fileState.key, {
  //                     progress: "COMPLETE",
  //                   });
  //                 }
  //               },
  //             });
  //           } else {
  //             // If no cv exists or it doesn't have a URL, upload as a new file
  //             res = await edgestore.publicFiles.upload({
  //               file: customFile,
  //               options: {}, // No replacement URL for a new upload
  //               signal: abortController.signal,
  //               onProgressChange: async (progress) => {
  //                 updateFileState(fileState.key, { progress });
  //                 if (progress === 100) {
  //                   updateFileState(fileState.key, {
  //                     progress: "COMPLETE",
  //                   });
  //                 }
  //               },
  //             });
  //           }

  //           // Use the original response URL if needed
  //           setUploadRes((uploadRes) => [
  //             ...uploadRes,
  //             {
  //               url: res.url,
  //               filename: customFileName, // Set the custom file name here
  //             },
  //           ]);

  //           // Prepare CV data to send to the backend
  //           const cvPayload = {
  //             name: customFileName,
  //             url: res.url, // The URL received from the file upload response
  //           };

  //           // Send CV data to the backend
  //           const response = await fetch("/api/cv", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify(cvPayload),
  //           });

  //           if (!response.ok) {
  //             throw new Error("Failed to send CV data to the backend");
  //           }

  //           const result = await response.json();
  //           console.log("CV data sent successfully:", result);
  //         } catch (err) {
  //           console.error(err);
  //           if (err instanceof UploadAbortedError) {
  //             updateFileState(fileState.key, {
  //               progress: "PENDING",
  //             });
  //           } else {
  //             updateFileState(fileState.key, {
  //               progress: "ERROR",
  //             });
  //           }
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Failed to process upload:", error);
  //   }
  // };

  // Define a type for the MIME type mapping
  type MimeTypeMap = {
    [key: string]: string; // This allows any string to be a key
  };

  // Define the MIME type to extension mapping
  const mimeToExt: MimeTypeMap = {
    "application/pdf": "pdf",
    "application/msword": "doc",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",
    "application/vnd.ms-excel": "xls",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
    "application/vnd.ms-powerpoint": "ppt",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",
    "text/plain": "txt",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/svg+xml": "svg",
    // Add other MIME types as needed
  };

  const handleUploadClick = async (
    cv: CV | undefined,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault(); // Prevent default button behavior

    try {
      await Promise.all(
        fileStates.map(async (fileState) => {
          try {
            if (fileState.progress !== "PENDING") return;
            const abortController = new AbortController();
            updateFileState(fileState.key, { abortController });

            // Use a default value if the MIME type is not found
            const fileExtension = mimeToExt[fileState.file.type] || "bin"; // Default to 'bin' if type not found
            const customFileName = `Nay_Myo_Khant_cv.${fileExtension}`; // Use the determined extension

            const customFile = new File([fileState.file], customFileName, {
              type: fileState.file.type,
            });
            console.log(
              "🚀 ~ fileStates.map ~ customFileName:",
              customFileName
            );

            // Upload logic remains unchanged
            let res;

            if (cv && cv.url) {
              // Replace existing file
              res = await edgestore.publicFiles.upload({
                file: customFile,
                options: {
                  replaceTargetUrl: cv.url, // Replace the existing URL
                },
                signal: abortController.signal,
                onProgressChange: async (progress) => {
                  updateFileState(fileState.key, { progress });
                  if (progress === 100) {
                    updateFileState(fileState.key, {
                      progress: "COMPLETE",
                    });
                  }
                },
              });
            } else {
              // Upload as a new file
              res = await edgestore.publicFiles.upload({
                file: customFile,
                options: {}, // No replacement URL for a new upload
                signal: abortController.signal,
                onProgressChange: async (progress) => {
                  updateFileState(fileState.key, { progress });
                  if (progress === 100) {
                    updateFileState(fileState.key, {
                      progress: "COMPLETE",
                    });
                  }
                },
              });
            }

            // Use the original response URL if needed
            setUploadRes((uploadRes) => [
              ...uploadRes,
              {
                url: res.url,
                filename: customFileName, // Set the custom file name here
              },
            ]);

            // Prepare CV data to send to the backend
            const cvPayload = {
              name: customFileName,
              url: res.url, // The URL received from the file upload response
            };

            // Send CV data to the backend
            const response = await fetch("/api/cv", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(cvPayload),
            });

            if (!response.ok) {
              throw new Error("Failed to send CV data to the backend");
            }

            const result = await response.json();
            console.log("CV data sent successfully:", result);
          } catch (err) {
            console.error(err);
            if (err instanceof UploadAbortedError) {
              updateFileState(fileState.key, {
                progress: "PENDING",
              });
            } else {
              updateFileState(fileState.key, {
                progress: "ERROR",
              });
            }
          }
        })
      );
    } catch (error) {
      console.error("Failed to process upload:", error);
    }
  };

  useEffect(() => {
    if (cv?.url) {
      const extension = cv.url.split(".").pop() ?? "pdf"; // Default to 'pdf' if no extension is found
      setViewCVurl(getDownloadUrl(cv.url, `Nay_Myo_Khant_cv.${extension}`));
    }
  }, [cv]);
  

  return (
    <div className="container mx-auto py-8 mt-16 px-4 max-w-7xl">
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
                <div className="relative w-full h-52 bg-gray-300 rounded-lg overflow-hidden shadow">
                  <div className="absolute top-0 left-0 w-full h-full glare"></div>
                </div>
              ) : (
                <Image
                  src={user?.imageUrl}
                  alt="Profile"
                  width={150}
                  height={150}
                  className="object-cover w-full h-full rounded-full md:rounded-sm"
                />
              )}
              <Button
                onClick={handlePersonalInfoSubmit}
                className="w-full mt-4 hidden md:block border border-gray-300"
              >
                Update Personal Info
              </Button>
            </div>

            <div className="w-full md:w-2/3 flex-grow space-y-2 mt-4 md:mt-0">
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

              <div className="space-y-2">
                <Label className="text-sm font-medium">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={personalInfo?.name || ""}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={personalInfo?.bio || ""}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  className="border-gray-300"
                  value={personalInfo?.description || ""}
                  onChange={handlePersonalInfoChange}
                />
              </div>
              <Button
                onClick={handlePersonalInfoSubmit}
                className="w-full mt-4 md:hidden block border border-gray-300"
              >
                Update Personal Info
              </Button>
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
              {skills.length < 1 && (
                <>
                  <Badge
                    variant="secondary"
                    className="text-red-600 animate-pulse w-[7ch] h-5 bg-red-100"
                  ></Badge>
                  <Badge
                    variant="secondary"
                    className="text-red-600 animate-pulse w-[10ch] h-5 bg-red-100"
                  ></Badge>
                  <Badge
                    variant="secondary"
                    className="text-red-600 animate-pulse w-[15ch] h-5 bg-red-100"
                  ></Badge>
                  <Badge
                    variant="secondary"
                    className="text-red-600 animate-pulse w-[8ch] h-5 bg-red-100"
                  ></Badge>
                  <Badge
                    variant="secondary"
                    className="text-red-600 animate-pulse w-[13ch] h-5 bg-red-100"
                  ></Badge>
                </>
              )}
              {skills.map((skill) => (
                <Badge
                  key={skill?.id}
                  variant="secondary"
                  className="text-red-600 bg-red-100"
                >
                  {skill?.name}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="ml-2 p-0 h-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="New skill"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    addSkill(e.currentTarget.value);
                    e.currentTarget.value = "";
                  }
                }}
              />
              <Button
                onClick={() => {
                  const input = document.querySelector(
                    'input[placeholder="New skill"]'
                  ) as HTMLInputElement;
                  if (input.value) {
                    addSkill(input.value);
                    input.value = "";
                  }
                }}
              >
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border relative rounded-none shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center text-red-600">
              <FileText className="mr-2 h-5 w-5" />
              CV
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className=" absolute top-5 right-5 z-40">
              {cv && (
                <div className="flex flex-col justify-start items-end">
                  <a
                    href={viewCVurl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-red-600 hover:underline"
                  >
                    View CV <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                  <p className=" text-base text-red-600">{cv.name}</p>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-start items-center space-x-2">
              {/* <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCVUpload(e.target.files[0]);
                  }
                }}
              /> */}
              <div className="h-24 w-full flex flex-col ">
                <MultiFileDropzone
                  className="flex-grow"
                  value={fileStates}
                  dropzoneOptions={{
                    maxFiles: 1,
                  }}
                  onChange={setFileStates}
                  onFilesAdded={async (addedFiles) => {
                    setFileStates([...fileStates, ...addedFiles]);
                  }}
                />
                <Button
                  className="mt-0"
                  // onClick={async () => {
                  //   await Promise.all(
                  //     fileStates.map(async (fileState) => {
                  //       try {
                  //         if (fileState.progress !== "PENDING") return;
                  //         const abortController = new AbortController();
                  //         updateFileState(fileState.key, { abortController });

                  //         // Create a custom file name
                  //         const customFileName = `Nay_Myo_Khant_cv`; // Adjust the prefix as needed
                  //         const customFile = new File(
                  //           [fileState.file],
                  //           customFileName,
                  //           { type: fileState.file.type }
                  //         );
                  //         console.log(
                  //           "🚀 ~ fileStates.map ~ customFileName:",
                  //           customFileName
                  //         );

                  //         const res = await edgestore.publicFiles.upload({
                  //           file: customFile,
                  //           // options: {
                  //           //   replaceTargetUrl: oldFileUrl,
                  //           // },
                  //           signal: abortController.signal,
                  //           onProgressChange: async (progress) => {
                  //             updateFileState(fileState.key, { progress });
                  //             if (progress === 100) {
                  //               updateFileState(fileState.key, {
                  //                 progress: "COMPLETE",
                  //               });
                  //             }
                  //           },
                  //         });

                  //         // Use the original response URL if needed
                  //         setUploadRes((uploadRes) => [
                  //           ...uploadRes,
                  //           {
                  //             url: res.url,
                  //             filename: customFileName, // Set the custom file name here
                  //           },
                  //         ]);
                  //       } catch (err) {
                  //         console.error(err);
                  //         if (err instanceof UploadAbortedError) {
                  //           updateFileState(fileState.key, {
                  //             progress: "PENDING",
                  //           });
                  //         } else {
                  //           updateFileState(fileState.key, {
                  //             progress: "ERROR",
                  //           });
                  //         }
                  //       }
                  //     })
                  //   );

                  //   // Save to
                  // }}
                  onClick={(event) => handleUploadClick(cv, event)}
                  disabled={
                    !fileStates.filter(
                      (fileState) => fileState.progress === "PENDING"
                    ).length
                  }
                >
                  Update
                </Button>
              </div>
            </div>
            {uploadRes.length > 0 && (
              <div className="mt-2">
                {uploadRes.map((res) => (
                  <a
                    key={res.url}
                    className="mt-2 block underline"
                    href={res.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {res.filename}
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border rounded-none shadow-none">
          <div className="flex justify-start items-center pr-5">
            {" "}
            <CardHeader>
              <CardTitle className="flex flex-row items-center text-red-600">
                <Briefcase className="mr-2 h-5 w-5" />
                Projects
              </CardTitle>
            </CardHeader>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="w-10 flex items-center justify-center"
                >
                  <Plus className="h-6 w-6" />
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
                  <div className="space-y-2">
                    <Label htmlFor="new-project-images">Project Images</Label>
                    <Input
                      id="new-project-images"
                      type="file"
                      multiple
                      accept="image/*"
                    />
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-full bg-gray-100 border-2 mt-4"
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
                    const imageInput = document.getElementById(
                      "new-project-images"
                    ) as HTMLInputElement;
                    const images = imageInput.files
                      ? Array.from(imageInput.files)
                      : [];
                    addProject({ name, description, link, images });
                  }}
                >
                  Add Project
                </Button>
              </DialogContent>
            </Dialog>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {projects.map((project) => (
                <Card key={project.id} className="bg-red-50">
                  <CardContent className="pt-6 space-y-2">
                    {project?.images?.length > 0 && (
                      <Image
                        src={
                          project.images.find((img) => img.isCover)?.url ||
                          project.images[0].url
                        }
                        alt={project.name}
                        width={300}
                        height={200}
                        className="object-cover w-full h-40 rounded"
                      />
                    )}
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
                    <div className="flex justify-between mt-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          // Open a dialog to edit project details and images
                          // This is a placeholder and should be replaced with a proper dialog component
                          alert("Edit project: " + project.name);
                        }}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
