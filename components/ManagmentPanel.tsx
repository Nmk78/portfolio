"use client";

import { Suspense, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";

import PersonalInformation from "./ManagmentPanelComponent/PersonalInformation";
import Skills from "./ManagmentPanelComponent/Skills";
import CV from "./ManagmentPanelComponent/CV";
import Projects from "./ManagmentPanelComponent/Projects";

export default function ManagementPanel() {

  return (
    <div className="container mx-auto py-8 mt-16 px-4 max-w-7xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
        {/* <PersonalInformation handlePersonalInfoSubmit={handlePersonalInfoSubmit} handlePersonalInfoChange={handlePersonalInfoChange}/> */}
        <Suspense
          fallback={
            <div className="text-center">
              Failed to show personal imformation
            </div>
          }
        >
          <PersonalInformation />
        </Suspense>

        <Suspense
          fallback={<div className="text-center">Failed to show skills</div>}
        >
          <Skills />
        </Suspense>

        <Suspense
          fallback={<div className="text-center">Failed to show CV</div>}
        >
          <CV />
        </Suspense>

        <Suspense
          fallback={<div className="text-center">Failed to show projects</div>}
        >
          <Projects />
        </Suspense>
      </div>
    </div>
  );
}
