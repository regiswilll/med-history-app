"use client";

import { useSyncExternalStore } from "react";
import { setDark } from "@/lib/theme";
import { btn } from "./ui";

function readIsDark() {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function subscribe(onChange: () => void) {
  // Fires for the toggle and for system-setting changes applied by the script.
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => observer.disconnect();
}

/** `null` until the browser theme is known (server render / before hydration). */
function useIsDark(): boolean | null {
  return useSyncExternalStore(subscribe, readIsDark, () => null);
}

/** "Dark Mode" on/off switch. The little track on the left shows the state. */
export default function ThemeToggle() {
  const isDark = useIsDark();
  const on = isDark === true;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => setDark(!on)}
      disabled={isDark === null}
      title={on ? "Switch to light mode" : "Switch to dark mode"}
      className={btn.primary}
    >
      <span
        aria-hidden
        className={`relative inline-flex h-4 w-7 shrink-0 items-center rounded-full transition-colors ${
          on ? "bg-white/90" : "bg-white/35"
        }`}
      >
        <span
          className={`absolute h-3 w-3 rounded-full transition-transform ${
            on ? "translate-x-3.5 bg-teal-700" : "translate-x-0.5 bg-white"
          }`}
        />
      </span>
      Dark Mode
    </button>
  );
}
