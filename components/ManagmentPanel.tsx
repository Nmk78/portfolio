"use client";

import { Suspense } from "react";
import {
  Trash2,
  Plus, Briefcase, ExternalLink,
  Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Project } from "@/lib/types";

import PersonalInformation from "./ManagmentPanelComponent/PersonalInformation";
import Skills from "./ManagmentPanelComponent/Skills";
import CV from "./ManagmentPanelComponent/CV";
import Projects from "./ManagmentPanelComponent/Projects";

export default function ManagementPanel() {


  return (
    <div className="container mx-auto py-8 mt-16 px-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">

        {/* <PersonalInformation handlePersonalInfoSubmit={handlePersonalInfoSubmit} handlePersonalInfoChange={handlePersonalInfoChange}/> */}
        <Suspense fallback={<div className="text-center">Failed to show personal imformation</div>}>
          <PersonalInformation/>
        </Suspense>

        <Suspense fallback={<div className="text-center">Failed to show skills</div>}>
          <Skills/>
        </Suspense>

        <Suspense fallback={<div className="text-center">Failed to show CV</div>}>
          <CV/>
        </Suspense>

        <Suspense fallback={<div className="text-center">Failed to show projects</div>}>
          <Projects/>
        </Suspense>
      </div>
    </div>
  );
}
