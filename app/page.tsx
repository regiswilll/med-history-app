import Link from "next/link";
import ExportButton from "@/components/ExportButton";
import MedicationList from "@/components/MedicationList";
import ThemeToggle from "@/components/ThemeToggle";
import { btn } from "@/components/ui";
import { routes } from "@/lib/routes";

export default function Home() {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My medicines</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Everything you take now and have taken before.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href={routes.newMedicine} className={btn.primary}>
            + Add medicine
          </Link>
          <ExportButton />
          <ThemeToggle />
        </div>
      </div>
      <MedicationList />
    </>
  );
}
