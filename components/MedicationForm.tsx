"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import {
  createMedication,
  StorageError,
  updateMedication,
  type Medication,
  type MedicationInput,
} from "@/lib/storage";
import { btn, card } from "./ui";

const EMPTY: MedicationInput = {
  name: "",
  dosage: "",
  frequency: "",
  reason: "",
  prescriber: "",
  startDate: "",
  endDate: "",
  notes: "",
};

const inputClass =
  "mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base sm:text-sm dark:border-slate-600 dark:bg-slate-900 aria-[invalid=true]:border-red-500";

export default function MedicationForm({ existing }: { existing?: Medication }) {
  const router = useRouter();
  const [values, setValues] = useState<MedicationInput>(() =>
    existing ? pick(existing) : EMPTY,
  );
  const [errors, setErrors] = useState<Partial<Record<keyof MedicationInput, string>>>({});
  const [saveError, setSaveError] = useState("");

  const set = (field: keyof MedicationInput) => (
    e: { target: { value: string } },
  ) => setValues((v) => ({ ...v, [field]: e.target.value }));

  function validate(v: MedicationInput) {
    const next: typeof errors = {};
    if (!v.name.trim()) next.name = "Please enter the medicine name.";
    if (v.startDate && v.endDate && v.endDate < v.startDate)
      next.endDate = "End date can't be before the start date.";
    return next;
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = Object.fromEntries(
      Object.entries(values).map(([k, val]) => [k, val.trim()]),
    ) as MedicationInput;
    const found = validate(trimmed);
    setErrors(found);
    if (Object.keys(found).length) return;
    try {
      const saved = existing
        ? updateMedication(existing.id, trimmed)
        : createMedication(trimmed);
      router.push(`/items/${saved.id}`);
    } catch (err) {
      setSaveError(err instanceof StorageError ? err.message : "Something went wrong saving.");
    }
  }

  const cancelHref = existing ? `/items/${existing.id}` : "/";

  return (
    <form onSubmit={onSubmit} noValidate className={`${card} space-y-5 p-4 sm:p-6`}>
      {saveError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {saveError}
        </p>
      )}

      <Field label="Medicine name" required error={errors.name} id="name">
        <input
          id="name"
          value={values.name}
          onChange={set("name")}
          className={inputClass}
          placeholder="e.g. Amoxicillin"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          autoFocus={!existing}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Dosage" id="dosage">
          <input id="dosage" value={values.dosage} onChange={set("dosage")} className={inputClass} placeholder="e.g. 500 mg" />
        </Field>
        <Field label="How often" id="frequency">
          <input id="frequency" value={values.frequency} onChange={set("frequency")} className={inputClass} placeholder="e.g. Twice a day" />
        </Field>
        <Field label="Reason / condition" id="reason">
          <input id="reason" value={values.reason} onChange={set("reason")} className={inputClass} placeholder="e.g. Sinus infection" />
        </Field>
        <Field label="Prescribed by" id="prescriber">
          <input id="prescriber" value={values.prescriber} onChange={set("prescriber")} className={inputClass} placeholder="e.g. Dr. Lee" />
        </Field>
        <Field label="Start date" id="startDate">
          <input id="startDate" type="date" value={values.startDate} onChange={set("startDate")} className={inputClass} />
        </Field>
        <Field label="End date" id="endDate" hint="Leave empty if you're still taking it." error={errors.endDate}>
          <input
            id="endDate"
            type="date"
            value={values.endDate}
            onChange={set("endDate")}
            className={inputClass}
            aria-invalid={!!errors.endDate}
            aria-describedby={errors.endDate ? "endDate-error" : "endDate-hint"}
          />
        </Field>
      </div>

      <Field label="Notes" id="notes">
        <textarea
          id="notes"
          rows={4}
          value={values.notes}
          onChange={set("notes")}
          className={inputClass}
          placeholder="Side effects, instructions, pharmacy…"
        />
      </Field>

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:justify-end dark:border-slate-700">
        <button type="button" onClick={() => router.push(cancelHref)} className={btn.secondary}>
          Cancel
        </button>
        <button type="submit" className={btn.primary}>
          {existing ? "Save changes" : "Add medicine"}
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  id,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-700 dark:text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function pick(m: Medication): MedicationInput {
  return {
    name: m.name,
    dosage: m.dosage,
    frequency: m.frequency,
    reason: m.reason,
    prescriber: m.prescriber,
    startDate: m.startDate,
    endDate: m.endDate,
    notes: m.notes,
  };
}
