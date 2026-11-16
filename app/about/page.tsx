import type { Metadata } from "next";
import Link from "next/link";
import { BackLink, btn, card } from "@/components/ui";

export const metadata: Metadata = { title: "About · Medicine History" };

export default function AboutPage() {
  return (
    <>
      <BackLink href="/">All medicines</BackLink>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">About</h1>
      <div className={`${card} space-y-4 p-4 leading-relaxed sm:p-6`}>
        <p>This is to record your medical history.</p>
        <p>Please include doctor visiting history in the &apos;Note&apos; part.</p>
        <p>It will be possible to import/export in the future update.</p>
        <div className="pt-2">
          <Link href="/" className={btn.primary}>
            Go to my medicines
          </Link>
        </div>
      </div>
    </>
  );
}
