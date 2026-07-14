import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AdminGate from "@/components/admin/AdminGate";

export const metadata: Metadata = {
  title: "Admin — Holiday Brothers",
  description: "Staff and owner administration.",
};

export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-3">
        <Image src="/logo.png" alt="Holiday Brothers" width={40} height={40} className="rounded-sm" />
        <span className="eyebrow">Holiday Brothers Admin</span>
      </Link>

      <AdminGate />
    </main>
  );
}
