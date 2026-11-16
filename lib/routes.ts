/**
 * Every address in the app, in one place.
 *
 * The site is published to GitHub Pages as plain files, so there is no server
 * to answer "/medicine/001". Instead each kind of page is one real file and the
 * medicine is chosen with "?id=001", which the page reads in the browser.
 * Trailing slashes match how the static files are laid out (folder/index.html).
 */
export const routes = {
  home: "/",
  about: "/about/",
  newMedicine: "/medicine/new/",
  medicine: (id: string) => `/medicine/?id=${encodeURIComponent(id)}`,
  editMedicine: (id: string) => `/medicine/edit/?id=${encodeURIComponent(id)}`,
};
