"use client";

import { useState } from "react";
import { useMedications } from "@/lib/storage";
import { btn } from "./ui";

/** Downloads every medicine as a PDF, in the same order as the main list. */
export default function ExportButton() {
  const items = useMedications();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const empty = !items || items.length === 0;

  async function onClick() {
    if (!items || empty) return;
    setBusy(true);
    setError("");
    try {
      const { exportAllToPdf } = await import("@/lib/exportPdf");
      await exportAllToPdf(items);
    } catch {
      setError("Couldn't create the PDF. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={empty || busy}
        title={empty ? "Add a medicine first — there's nothing to export yet" : "Download all medicines as a PDF"}
        className={`${btn.primary} disabled:cursor-not-allowed`}
      >
        {busy ? "Preparing PDF…" : "Export all"}
      </button>
      {error && (
        <p role="alert" className="w-full text-sm text-red-700 sm:text-right dark:text-red-300">
          {error}
        </p>
      )}
    </>
  );
}
