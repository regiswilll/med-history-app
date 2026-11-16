import Link from "next/link";
import type { ReactNode } from "react";

export const btn = {
  primary:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-60",
  secondary:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
  danger:
    "inline-flex items-center justify-center gap-2 rounded-lg border border-red-300 bg-white px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-800 dark:bg-slate-800 dark:text-red-300 dark:hover:bg-red-950",
  dangerSolid:
    "inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600",
};

export const card =
  "rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800";

export function StatusBadge({ current }: { current: boolean }) {
  return current ? (
    <span className="inline-flex shrink-0 items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-200">
      Current
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-200">
      Past
    </span>
  );
}

/** Friendly full-panel message used for empty, loading and not-found states. */
export function Message({
  icon,
  title,
  children,
  action,
}: {
  icon: string;
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={`${card} flex flex-col items-center px-6 py-14 text-center`}>
      <div aria-hidden className="mb-4 text-4xl">
        {icon}
      </div>
      <h2 className="text-lg font-semibold">{title}</h2>
      {children && (
        <div className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-300">{children}</div>
      )}
      {action && <div className="mt-6 flex flex-wrap justify-center gap-3">{action}</div>}
    </div>
  );
}

export function Loading() {
  return (
    <div className={`${card} px-6 py-14 text-center text-sm text-slate-500`} role="status">
      Loading your medicine history…
    </div>
  );
}

export function NotFoundMessage({ id }: { id?: string }) {
  return (
    <Message
      icon="🔍"
      title="We couldn't find that page"
      action={
        <Link href="/" className={btn.primary}>
          Back to my medicines
        </Link>
      }
    >
      {id ? (
        <>
          There&apos;s no medication with ID <strong className="font-mono">{id}</strong>. It may have
          been deleted, or the link may have a typo.
        </>
      ) : (
        <>The address you followed doesn&apos;t exist. It may have moved or been mistyped.</>
      )}
    </Message>
  );
}

export function BackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-teal-700 hover:underline dark:text-teal-400"
    >
      <span aria-hidden>←</span> {children}
    </Link>
  );
}
