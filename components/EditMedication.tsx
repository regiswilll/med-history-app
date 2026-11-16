"use client";

import { useSearchParams } from "next/navigation";
import { routes } from "@/lib/routes";
import { useMedications } from "@/lib/storage";
import MedicationForm from "./MedicationForm";
import { BackLink, Loading, NotFoundMessage } from "./ui";

export default function EditMedication() {
  const id = useSearchParams().get("id") ?? "";
  const items = useMedications();
  if (items === null) return <Loading />;
  const item = items.find((m) => m.id === id);
  if (!item) {
    return (
      <>
        <BackLink href={routes.home}>All medicines</BackLink>
        <NotFoundMessage id={id} />
      </>
    );
  }
  return (
    <>
      <BackLink href={routes.medicine(item.id)}>Back to details</BackLink>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Edit {item.name}</h1>
      {/* key resets the form if a different record is loaded */}
      <MedicationForm key={item.id} existing={item} />
    </>
  );
}
