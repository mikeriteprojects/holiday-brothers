import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { assetPath } from "@/lib/basePath";
import { PAMPHLETS, getPamphlet } from "@/lib/home/pamphlets";

export function generateStaticParams() {
  return PAMPHLETS.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const pamphlet = getPamphlet(params.slug);
  return {
    title: pamphlet ? `${pamphlet.label} — Holiday Brothers` : "Holiday Brothers",
    description: pamphlet?.short,
  };
}

export default function PamphletPage({ params }: { params: { slug: string } }) {
  const pamphlet = getPamphlet(params.slug);
  if (!pamphlet) notFound();

  return (
    <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="mb-10 inline-flex items-center gap-3">
        <Image src={assetPath("/logo.png")} alt="Holiday Brothers" width={40} height={40} className="rounded-sm" />
        <span className="eyebrow">Holiday Brothers</span>
      </Link>

      <p className="eyebrow mb-3">{pamphlet.label}</p>
      <h1 className="mb-8">{pamphlet.short}</h1>

      <div className="space-y-5">
        {pamphlet.long.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        {PAMPHLETS.filter((p) => p.slug !== pamphlet.slug).map((p) => (
          <Link key={p.slug} href={`/about/${p.slug}`} className="btn">
            {p.label} →
          </Link>
        ))}
      </div>
    </main>
  );
}
