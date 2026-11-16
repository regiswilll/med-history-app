import { useSyncExternalStore } from "react";

/**
 * All medication records live in the browser's localStorage under one key.
 * The whole list is small (a person's lifetime of prescriptions is a few
 * hundred KB at most), so a single JSON blob is simple and well inside the
 * ~5 MB per-origin localStorage limit.
 */

export type Medication = {
  id: string; // zero-padded sequence, e.g. "001"
  name: string;
  dosage: string;
  frequency: string;
  reason: string;
  prescriber: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD, or "" while still being taken
  notes: string;
  createdAt: string; // ISO timestamp
  updatedAt: string; // ISO timestamp
  pinned?: boolean; // optional so records saved before pinning existed still load
};

export type MedicationInput = Omit<Medication, "id" | "createdAt" | "updatedAt" | "pinned">;

type Store = { version: 1; nextId: number; items: Medication[] };

const KEY = "med-history:v1";
const EMPTY: Store = { version: 1, nextId: 1, items: [] };

export class StorageError extends Error {}

// ---------- low-level read/write ----------

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    // Storage blocked (e.g. some private modes or disabled site data).
    return null;
  }
}

function parse(raw: string | null): Store {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<Store>;
    if (!Array.isArray(data.items)) return EMPTY;
    return {
      version: 1,
      nextId: typeof data.nextId === "number" ? data.nextId : data.items.length + 1,
      items: data.items,
    };
  } catch {
    return EMPTY;
  }
}

function write(store: Store) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(store));
  } catch (err) {
    const quota = err instanceof DOMException && err.name === "QuotaExceededError";
    throw new StorageError(
      quota
        ? "Your browser's storage is full, so this change couldn't be saved."
        : "Your browser blocked saving. Check that site data / cookies are allowed.",
    );
  }
  emit();
}

// ---------- subscription (keeps React in sync, including across tabs) ----------

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY || e.key === null) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

// Cache the parsed snapshot by raw string so useSyncExternalStore gets a
// stable reference between renders.
let cachedRaw: string | null | undefined;
let cachedStore: Store = EMPTY;
function getSnapshot(): Store {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedStore = parse(raw);
  }
  return cachedStore;
}

/** Returns `null` during server render / before hydration, then the store. */
export function useMedications(): Medication[] | null {
  const store = useSyncExternalStore(subscribe, getSnapshot, () => null);
  return store ? store.items : null;
}

// ---------- CRUD ----------

export function formatId(n: number) {
  return String(n).padStart(3, "0");
}

export function createMedication(input: MedicationInput): Medication {
  const store = getSnapshot();
  const now = new Date().toISOString();
  const item: Medication = {
    ...input,
    id: formatId(store.nextId),
    createdAt: now,
    updatedAt: now,
  };
  write({ ...store, nextId: store.nextId + 1, items: [...store.items, item] });
  return item;
}

export function updateMedication(id: string, input: MedicationInput): Medication {
  const store = getSnapshot();
  const existing = store.items.find((m) => m.id === id);
  if (!existing) throw new StorageError("This medication no longer exists.");
  const updated: Medication = { ...existing, ...input, updatedAt: new Date().toISOString() };
  write({ ...store, items: store.items.map((m) => (m.id === id ? updated : m)) });
  return updated;
}

export function deleteMedication(id: string) {
  const store = getSnapshot();
  write({ ...store, items: store.items.filter((m) => m.id !== id) });
}

/** Pin or unpin. Doesn't touch updatedAt — pinning is a view preference, not an edit. */
export function setPinned(id: string, pinned: boolean) {
  const store = getSnapshot();
  write({ ...store, items: store.items.map((m) => (m.id === id ? { ...m, pinned } : m)) });
}

// ---------- helpers ----------

export function isCurrent(m: Medication, today = todayISO()) {
  return !m.endDate || m.endDate >= today;
}

export function todayISO() {
  const d = new Date();
  const tz = d.getTimezoneOffset() * 60_000;
  return new Date(d.getTime() - tz).toISOString().slice(0, 10);
}

export function formatDate(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
