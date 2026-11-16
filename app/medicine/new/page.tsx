import type { Metadata } from "next";
import MedicationForm from "@/components/MedicationForm";
import { BackLink } from "@/components/ui";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Add medicine · Medicine History" };

// Address: /medicine/new/
export default function NewMedicinePage() {
  return (
    <>
      <BackLink href={routes.home}>All medicines</BackLink>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Add a medicine</h1>
      <MedicationForm />
    </>
  );
}
