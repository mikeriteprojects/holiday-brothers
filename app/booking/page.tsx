import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import BookingStepper from "@/components/booking/BookingStepper";

export const metadata: Metadata = {
  title: "Book a Sukkah — Holiday Brothers",
  description: "Book your sukkah build with Holiday Brothers in a few quick steps.",
};

export default function BookingPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-3">
        <Image src="/logo.png" alt="Holiday Brothers" width={40} height={40} className="rounded-sm" />
        <span className="eyebrow">Holiday Brothers</span>
      </Link>

      <h1 className="mb-2">Book your sukkah</h1>
      <p className="mb-10 max-w-xl">
        A few quick questions and we&rsquo;ll have your crew scheduled.
      </p>

      <BookingStepper />
    </main>
  );
}
