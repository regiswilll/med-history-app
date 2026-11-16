# Medicine History

A personal medicine history app. Record the medicines you take and have taken: dosage, how often, why, who prescribed them, start and end dates, and notes. You can add, edit, delete and pin records.

**Live site:** https://regiswilll.github.io/med-history-app/

Your records are stored only in your own browser (localStorage). Nothing is sent to a server, and records don't sync between browsers or devices.

## Pages

| Page | Address |
|---|---|
| All medicines | `/` |
| Add a medicine | `/medicine/new/` |
| One medicine | `/medicine/?id=001` |
| Edit a medicine | `/medicine/edit/?id=001` |
| About | `/about/` |

The site is hosted on GitHub Pages as plain files, with no server. That's why a medicine is picked with `?id=001` and not with an address like `/medicine/001`.

## Running locally

```bash
npm install
npm run dev
```

Then open the address it prints, usually http://localhost:3000.

## Publishing

Every push to `main` builds the site and publishes it to GitHub Pages. The workflow is in `.github/workflows/deploy.yml`. To check the production build locally:

```bash
npm run build   # writes the static site to ./out
```
