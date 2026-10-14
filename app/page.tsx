import { Hero } from "@/components/sections/Hero";
import { Intro } from "@/components/sections/Intro";
import { SelectedWork } from "@/components/sections/SelectedWork";
import { Capabilities } from "@/components/sections/Capabilities";
import { Clients } from "@/components/sections/Clients";
import { ContactTeaser } from "@/components/sections/ContactTeaser";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <SelectedWork />
      <Capabilities />
      <Clients />
      <ContactTeaser />
    </>
  );
}
