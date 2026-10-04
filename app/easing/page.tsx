import Link from "next/link";
import type { Metadata } from "next";
import { EasingLab } from "@/components/easing/easing-lab";

export const metadata: Metadata = {
  title: "Easing lab",
  description: "Scrub time and race every GSAP ease side by side, then copy the GSAP or CSS code.",
};

export default function EasingPage() {
  return (
    <main className="mx-auto flex max-w-[1280px] flex-col gap-8 px-4 pt-12 pb-16 sm:px-6">
      <EasingLab />
      <Link href="/" className="text-sm text-muted hover:text-ink">
        ← Back to recipes
      </Link>
    </main>
  );
}
