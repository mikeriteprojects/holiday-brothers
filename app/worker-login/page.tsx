import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { assetPath } from "@/lib/basePath";
import WorkerLoginForm from "@/components/worker/WorkerLoginForm";

export const metadata: Metadata = {
  title: "Crew Sign In — Holiday Brothers",
  description: "Sign in to your Holiday Brothers crew account.",
};

export default function WorkerLoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-3">
        <Image src={assetPath("/logo.png")} alt="Holiday Brothers" width={40} height={40} className="rounded-sm" />
        <span className="eyebrow">Holiday Brothers</span>
      </Link>

      <h1 className="mb-8">Crew sign in</h1>

      <WorkerLoginForm />
    </main>
  );
}
