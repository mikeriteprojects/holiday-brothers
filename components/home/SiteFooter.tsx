import Link from "next/link";

/**
 * Contact details below are placeholders — replace with the real phone/
 * email before this goes live for real.
 */
export default function SiteFooter() {
  return (
    <footer className="px-4 py-16 text-center sm:px-6" style={{ background: "var(--bg-deep)" }}>
      <p className="eyebrow mb-3">Get in touch</p>
      <p style={{ color: "var(--text-cream)" }}>hello@holidaybrothers.com · (845) 555-0142</p>
      <p className="mt-2" style={{ color: "var(--text-muted)" }}>
        Rockland County, NY
      </p>

      <div className="mt-8">
        <Link href="/worker-login" className="btn">
          Already have an account? Login
        </Link>
      </div>

      <p className="eyebrow mt-12">Holiday Brothers · Est. by the Kurkus family</p>
    </footer>
  );
}
