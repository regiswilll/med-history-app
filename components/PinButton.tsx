"use client";

import { setPinned, StorageError, type Medication } from "@/lib/storage";
import { btn } from "./ui";

function PinIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 17v5" />
      <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z" />
    </svg>
  );
}

/**
 * Toggles an item's pinned state.
 * - "icon": compact round button for list cards
 * - "full": labelled button for the detail page
 */
export default function PinButton({
  item,
  variant = "icon",
  onError,
  className = "",
}: {
  item: Medication;
  variant?: "icon" | "full";
  onError?: (message: string) => void;
  className?: string;
}) {
  const pinned = !!item.pinned;
  const label = `${pinned ? "Unpin" : "Pin"} ${item.name}`;

  function toggle() {
    try {
      setPinned(item.id, !pinned);
    } catch (err) {
      onError?.(err instanceof StorageError ? err.message : "Couldn't update the pin.");
    }
  }

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={toggle}
        aria-pressed={pinned}
        className={`${btn.secondary} ${pinned ? "text-teal-700 dark:text-teal-300" : ""} ${className}`}
      >
        <PinIcon filled={pinned} />
        {pinned ? "Unpin" : "Pin to top"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={pinned}
      aria-label={label}
      title={pinned ? "Unpin" : "Pin to top"}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-teal-700 ${
        pinned
          ? "bg-teal-700 text-white hover:bg-teal-800"
          : "text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
      } ${className}`}
    >
      <PinIcon filled={pinned} />
    </button>
  );
}
