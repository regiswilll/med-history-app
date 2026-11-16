/**
 * Light/dark theme.
 * - The theme is the `data-theme` attribute on <html> ("light" | "dark");
 *   Tailwind's `dark:` styles key off it (see app/globals.css).
 * - A choice made with the toggle is saved in localStorage and wins.
 * - With no saved choice, the device's system setting is followed.
 */
export const THEME_KEY = "med-history:theme";

/**
 * Runs in <head> before the page is painted, so there's no flash of the
 * wrong theme. Also keeps following the system setting while no choice
 * has been saved.
 */
export const themeInitScript = `(function(){try{
var d=document.documentElement,k=${JSON.stringify(THEME_KEY)},m=window.matchMedia("(prefers-color-scheme: dark)");
function apply(){var s=null;try{s=localStorage.getItem(k)}catch(e){}
d.setAttribute("data-theme",s==="dark"||s==="light"?s:(m.matches?"dark":"light"))}
apply();m.addEventListener("change",apply);
}catch(e){}})()`;

export function setDark(dark: boolean) {
  const theme = dark ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // Storage blocked: the theme still changes for this visit.
  }
}
