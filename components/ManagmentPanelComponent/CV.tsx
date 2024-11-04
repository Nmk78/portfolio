"use client";

import { useEffect, useState } from "react";
import { ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useUser } from "@clerk/nextjs";
import { CV as CV_type, MimeTypeMap } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { FileState, MultiFileDropzone } from "@/lib/EdgeMultiFileUploadZone";
import { useEdgeStore } from "@/lib/edgestore";
import { UploadAbortedError } from "@edgestore/react/errors";
import { useData } from "@/context/DataContext";

const CV = () => {
  const { edgestore } = useEdgeStore();

  // const [cv, setCv] = useState<CV_type | undefined>(undefined);
  const [viewCVurl, setViewCVurl] = useState<string | undefined>(undefined);
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [uploadRes, setUploadRes] = useState<
    {
      url: string;
      filename: string;
    }[]
  >([]);

  // const fetchCV = async () => {
  //   const { data } = await axios.get("/api/cv"); // Adjust the API endpoint accordingly
  //   setCv(data.data);
  //   return data;
  // };

  // const { data, isLoading, error } = useQuery({

  //   queryKey: ["cv"],
  //   queryFn: fetchCV,
  // });

  // useEffect(() => {
  //   if (!error && !isLoading) {
  //     setCv(data.data);
  //   }
  // }, [data, isLoading, error]);

  const { cv, isLoading, error } = useData();

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

  const handleUploadClick = async (
    cv: CV_type | undefined,
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

  return (
    <Card className="border relative rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <FileText className="mr-2 h-5 w-5" />
          CV
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className=" absolute top-5 right-5 z-40">
          {isLoading && !cv ? (
            // Skeleton Loader
            <div className="flex flex-col justify-start items-end animate-pulse space-y-2">
              <div className="h-4 w-24 bg-gray-300 rounded-md"></div>{" "}
              {/* Skeleton for the link */}
              <div className="h-6 w-40 bg-gray-300 rounded-md"></div>{" "}
              {/* Skeleton for the CV name */}
            </div>
          ) : (
            cv && (
              <div className="flex flex-col justify-start items-end">
                <a
                  href={viewCVurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-red-600 hover:underline"
                >
                  View CV <ExternalLink className="ml-1 h-3 w-3" />
                </a>
                <p className="text-base text-red-600">{cv.name}</p>
              </div>
            )
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
  );
};

export default CV;
