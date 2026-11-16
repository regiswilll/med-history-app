"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { routes } from "@/lib/routes";
import {
  deleteMedication,
  formatDate,
  isCurrent,
  StorageError,
  useMedications,
} from "@/lib/storage";
import PinButton from "./PinButton";
import { btn, card, Loading, NotFoundMessage, StatusBadge } from "./ui";

export default function MedicationDetail() {
  const id = useSearchParams().get("id") ?? "";
  const items = useMedications();
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  const item = items?.find((m) => m.id === id);

  useEffect(() => {
    if (item) document.title = `${item.name} · Medicine History`;
  }, [item]);

  if (items === null) return <Loading />;
  // While a delete is navigating away, don't flash the "not found" message.
  if (!item) return deleting ? <Loading /> : <NotFoundMessage id={id} />;

  function confirmDelete() {
    try {
      setDeleting(true);
      deleteMedication(id);
      router.replace(routes.home);
    } catch (err) {
      setDeleting(false);
      dialogRef.current?.close();
      setError(err instanceof StorageError ? err.message : "Couldn't delete this medicine.");
    }
  }

  const rows: [string, string][] = [
    ["Dosage", item.dosage],
    ["How often", item.frequency],
    ["Reason / condition", item.reason],
    ["Prescribed by", item.prescriber],
    ["Started", item.startDate ? formatDate(item.startDate) : ""],
    ["Stopped", item.endDate ? formatDate(item.endDate) : "Still taking"],
  ];

  return (
    <>
      <article className={`${card} overflow-hidden`}>
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-200 p-4 sm:p-6 dark:border-slate-700">
          <div className="min-w-0">
            <p className="font-mono text-xs text-slate-500 dark:text-slate-400">#{item.id}</p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight break-words sm:text-3xl">
              {item.name}
            </h1>
          </div>
          <StatusBadge current={isCurrent(item)} />
        </div>

        {error && (
          <p role="alert" className="mx-4 mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 sm:mx-6 dark:bg-red-950 dark:text-red-200">
            {error}
          </p>
        )}

        <dl className="grid gap-x-6 gap-y-4 p-4 sm:grid-cols-2 sm:p-6">
          {rows.map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
                {label}
              </dt>
              <dd className={`mt-1 ${value ? "" : "text-slate-400 italic dark:text-slate-500"}`}>
                {value || "Not recorded"}
              </dd>
            </div>
          ))}
          <div className="sm:col-span-2">
            <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase dark:text-slate-400">
              Notes
            </dt>
            <dd className={`mt-1 whitespace-pre-wrap break-words ${item.notes ? "" : "text-slate-400 italic dark:text-slate-500"}`}>
              {item.notes || "No notes"}
            </dd>
          </div>
        </dl>

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Last updated {new Date(item.updatedAt).toLocaleString()}
          </p>
          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" className={btn.danger} onClick={() => dialogRef.current?.showModal()}>
              Delete
            </button>
            <PinButton item={item} variant="full" onError={setError} />
            <Link href={routes.editMedicine(item.id)} className={btn.primary}>
              Edit
            </Link>
          </div>
        </div>
      </article>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-title"
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-xl bg-white p-6 text-slate-900 shadow-xl backdrop:bg-black/40 dark:bg-slate-800 dark:text-slate-100"
      >
        <h2 id="delete-title" className="text-lg font-semibold">
          Delete {item.name}?
        </h2>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
          This permanently removes this record from this device. It can&apos;t be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" className={btn.secondary} onClick={() => dialogRef.current?.close()} autoFocus>
            Cancel
          </button>
          <button type="button" className={btn.dangerSolid} onClick={confirmDelete}>
            Delete
          </button>
        </div>
      </dialog>
    </>
  );
}
