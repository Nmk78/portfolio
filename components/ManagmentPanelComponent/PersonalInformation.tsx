"use client";

import React from "react";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { PersonalInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import ContextManager from "./Context";

// const PersonalInformation = ({handlePersonalInfoSubmit, handlePersonalInfoChange}) => {
const PersonalInformation = () => {
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const { user } = useUser();

  const fetchPersonalInfo = async () => {
    const { data } = await axios.get("/api/info"); // Adjust the API endpoint accordingly
    return data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["personalInfo"],
    queryFn: fetchPersonalInfo,
  });

  useEffect(() => {
    if (!error && !isLoading) {
      setPersonalInfo(data.data);
    }
  }, [data, isLoading, error]);

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
  return (
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
          <div className="w-full space-y-2 my-2 flex flex-col justify-end items-center">
            <ContextManager />
            <Button
              onClick={handlePersonalInfoSubmit}
              className="w-full hidden md:block border border-gray-300"
            >
              Update Personal Info
            </Button>
          </div>
        </div>

        <div className="w-full md:w-2/3 flex-grow space-y-2 mt-4 md:mt-0">
          <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2 space-y-2">
              <Label className="text-sm font-medium">Github</Label>
              {!personalInfo ? (
                <div className="w-full rounded-md h-10 animate-pulse bg-gray-200"></div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-between cursor-not-allowed opacity-70"
                >
                  {user?.username}
                </Button>
              )}
            </div>
            <div className="w-full sm:w-1/2 space-y-2">
              <Label className="text-sm font-medium">Email</Label>
              {!personalInfo ? (
                <div className="w-full rounded-md h-10 animate-pulse bg-gray-200"></div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-between overflow-x-clip cursor-not-allowed opacity-70"
                >
                  {user?.primaryEmailAddress?.emailAddress}
                </Button>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Name</Label>
            {!personalInfo ? (
              <div className="w-full rounded-md h-10 animate-pulse bg-gray-200"></div>
            ) : (
              <Input
                id="name"
                name="name"
                value={personalInfo?.name || ""}
                onChange={(e) => {
                  handlePersonalInfoChange(e);
                }}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Bio</Label>
            {!personalInfo ? (
              <div className="w-full rounded-md h-10 animate-pulse bg-gray-200"></div>
            ) : (
              <Input
                id="bio"
                name="bio"
                value={personalInfo?.bio || ""}
                onChange={(e) => {
                  handlePersonalInfoChange(e);
                }}
              />
            )}
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Description</Label>
            {!personalInfo ? (
              <div className="w-full rounded-md min-h-[80px] animate-pulse bg-gray-200"></div>
            ) : (
              <Textarea
                id="description"
                name="description"
                className="border-gray-300"
                value={personalInfo?.description || ""}
                onChange={(e) => {
                  handlePersonalInfoChange(e);
                }}
              />
            )}
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
  );
};

export default PersonalInformation;
