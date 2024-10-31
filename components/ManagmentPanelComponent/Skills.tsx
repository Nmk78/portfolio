"use client";


import { useEffect, useState } from "react";
import { Code, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useUser } from "@clerk/nextjs";
import { Skill } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { delay } from "framer-motion";

const Skills = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const fetchSkills = async () => {
    const { data } = await axios.get("/api/skills"); // Adjust the API endpoint accordingly
    return data;
  };

  const { data, isLoading, error } = useQuery({

    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  useEffect(() => {
    if (!error && !isLoading) {
      setSkills(data.data);
    }
  }, [data, isLoading, error]);

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

  return (
    <Card className="border rounded-none shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center text-red-600">
          <Code className="mr-2 h-5 w-5" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {isLoading  && (
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
          {skills.length > 0 && skills.map((skill) => (
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
          {/* <Button
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
          </Button> */}
        </div>
      </CardContent>
    </Card>
  );
};

export default Skills;
