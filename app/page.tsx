import type { Metadata } from "next";
import HomeHero from "@/components/home/HomeHero";

export const metadata: Metadata = {
  title: "Holiday Brothers — Sukkah Building, Rockland County",
  description:
    "Sukkah building and Jewish holiday services in Rockland County. Book a sukkah, join the crew, or sign in as staff.",
};

export default function Home() {
  return <HomeHero />;
}
