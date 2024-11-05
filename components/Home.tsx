import { HeroParallax } from "@/components/ui/hero-parallax";
import React from "react";
import Footer from "./Footer";
import Chat from "./Chat";


export default function Home() {


  return (
    <>
      <HeroParallax />

      <Chat/>
      <Footer />
    </>
);
}
