import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/basePath";
import JoinCrewForm from "@/components/join-crew/JoinCrewForm";

export const metadata: Metadata = {
  title: "Join the Crew — Holiday Brothers",
  description: "Apply to build or drive for Holiday Brothers.",
};

export default function JoinCrewPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-3">
        <Image src={assetPath("/logo.png")} alt="Holiday Brothers" width={40} height={40} className="rounded-sm" />
        <span className="eyebrow">Holiday Brothers</span>
      </Link>

      <h1 className="mb-2">Join the crew</h1>
      <p className="mb-10 max-w-xl">Builders and drivers, any age 16+ (younger with guardian consent).</p>

      <JoinCrewForm />
    </main>
  );
}
