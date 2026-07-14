import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/basePath";
import WorkerPortal from "@/components/worker/WorkerPortal";

export const metadata: Metadata = {
  title: "Crew Dashboard — Holiday Brothers",
  description: "Your jobs, points, and rewards.",
};

export default function WorkerPortalPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-3">
        <Image src={assetPath("/logo.png")} alt="Holiday Brothers" width={40} height={40} className="rounded-sm" />
        <span className="eyebrow">Holiday Brothers</span>
      </Link>

      <WorkerPortal />
    </main>
  );
}
