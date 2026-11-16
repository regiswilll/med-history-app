"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  compareForDisplay,
  formatDate,
  isCurrent,
  useMedications,
  todayISO,
} from "@/lib/storage";
import { routes } from "@/lib/routes";
import PinButton from "./PinButton";
import { btn, card, Loading, Message, StatusBadge } from "./ui";

type Filter = "all" | "current" | "past";

export default function MedicationList() {
  const items = useMedications();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [error, setError] = useState("");

  const visible = useMemo(() => {
    if (!items) return [];
    const today = todayISO();
    const q = query.trim().toLowerCase();
    return items
      .filter((m) => {
        if (filter === "current" && !isCurrent(m, today)) return false;
        if (filter === "past" && isCurrent(m, today)) return false;
        if (!q) return true;
        return [m.name, m.reason, m.prescriber, m.dosage].some((f) =>
          f.toLowerCase().includes(q),
        );
      })
      .sort(compareForDisplay(today));
  }, [items, query, filter]);

  if (items === null) return <Loading />;

  if (items.length === 0) {
    return (
      <Message
        icon="💊"
        title="No medicines recorded yet"
        action={
          <Link href={routes.newMedicine} className={btn.primary}>
            + Add your first medicine
          </Link>
        }
      >
        Keep track of what you take, why, and when you started or stopped. Everything stays on
        this device.
      </Message>
    );
  }

  const today = todayISO();
  const currentCount = items.filter((m) => isCurrent(m, today)).length;

  return (
    <div className="space-y-4">
      {error && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950 dark:text-red-200">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <span className="sr-only">Search medicines</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, reason, prescriber…"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base sm:text-sm dark:border-slate-600 dark:bg-slate-800"
          />
        </label>
        <div
          role="radiogroup"
          aria-label="Filter"
          className="grid grid-cols-3 rounded-lg border border-slate-300 bg-white p-1 text-sm dark:border-slate-600 dark:bg-slate-800"
        >
          {(
            [
              ["all", `All (${items.length})`],
              ["current", `Current (${currentCount})`],
              ["past", `Past (${items.length - currentCount})`],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={filter === value}
              onClick={() => setFilter(value)}
              className={`whitespace-nowrap rounded-md px-3 py-1.5 font-medium transition ${
                filter === value
                  ? "bg-teal-700 text-white"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {visible.length === 0 ? (
        <Message
          icon="🔎"
          title="No matches"
          action={
            <button
              type="button"
              className={btn.secondary}
              onClick={() => {
                setQuery("");
                setFilter("all");
              }}
            >
              Clear search and filters
            </button>
          }
        >
          Nothing matches your current search or filter.
        </Message>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {visible.map((m) => (
            <li key={m.id} className="relative">
              <Link
                href={routes.medicine(m.id)}
                className={`${card} block h-full p-4 pb-12 transition hover:border-teal-500 hover:shadow-md focus-visible:outline-2 focus-visible:outline-teal-700 ${
                  m.pinned ? "border-teal-300 ring-1 ring-teal-300 dark:border-teal-700 dark:ring-teal-700" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold break-words">
                    {m.pinned && <span className="sr-only">Pinned: </span>}
                    {m.name}
                  </h3>
                  <StatusBadge current={isCurrent(m, today)} />
                </div>
                {(m.dosage || m.frequency) && (
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {[m.dosage, m.frequency].filter(Boolean).join(" · ")}
                  </p>
                )}
                {m.reason && (
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">For {m.reason}</p>
                )}
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  {m.startDate ? formatDate(m.startDate) : "Start unknown"} –{" "}
                  {m.endDate ? formatDate(m.endDate) : "ongoing"}
                </p>
              </Link>
              {/* Sits outside the link (a button can't be nested in an <a>). */}
              <PinButton item={m} onError={setError} className="absolute right-3 bottom-3" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
