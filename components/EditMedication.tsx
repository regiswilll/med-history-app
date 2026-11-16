"use client";

import { useMedications } from "@/lib/storage";
import MedicationForm from "./MedicationForm";
import { Loading, NotFoundMessage } from "./ui";

export default function EditMedication({ id }: { id: string }) {
  const items = useMedications();
  if (items === null) return <Loading />;
  const item = items.find((m) => m.id === id);
  if (!item) return <NotFoundMessage id={id} />;
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Edit {item.name}</h1>
      {/* key resets the form if a different record is loaded */}
      <MedicationForm key={item.id} existing={item} />
    </>
  );
}
