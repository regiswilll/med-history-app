import type { Metadata } from "next";
import MedicationForm from "@/components/MedicationForm";
import { BackLink } from "@/components/ui";

export const metadata: Metadata = { title: "Add medicine · Medicine History" };

export default function NewItemPage() {
  return (
    <>
      <BackLink href="/">All medicines</BackLink>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Add a medicine</h1>
      <MedicationForm />
    </>
  );
}
